/**
 * @fileoverview Passport.js configuration for Google OAuth 2.0 authentication.
 * Includes user serialization, deserialization, and the Google strategy setup.
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { faker } = require('@faker-js/faker'); // For generating unique IDs for new users
const { readData, writeData } = require('../utils/fileUtils');

const usersFilePath = './data/users.json'; // Path to the users data store

/**
 * Serializes the user object to store in the session.
 * Stores only the user ID to keep the session lightweight.
 * @param {object} user - The user object to serialize.
 * @param {function} done - Callback to be called when serialization is complete.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserializes the user object from the session.
 * Retrieves the full user object from the stored ID.
 * @param {string} id - The user ID stored in the session.
 * @param {function} done - Callback to be called when deserialization is complete.
 */
passport.deserializeUser((id, done) => {
  try {
    const users = readData(usersFilePath);
    const user = users.find(u => u.id === id);
    if (user) {
      done(null, user);
    } else {
      done(null, false, { message: 'User not found.' }); // Or done(new Error('User not found'));
    }
  } catch (err) {
    done(err);
  }
});

/**
 * Configures the Google OAuth 2.0 strategy for Passport.
 * Handles user lookup and creation based on the Google profile.
 * GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET should be set as environment variables.
 * Callback URL is set to '/api/users/auth/google/callback'.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER',
      callbackURL: '/api/users/auth/google/callback', // Ensure this matches your Google Cloud Console setup
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log('Google Profile:', JSON.stringify(profile, null, 2)); // Optional: for debugging

        const users = readData(usersFilePath);
        let user = users.find(u => u.googleId === profile.id);

        if (user) {
          // User found, return them
          return done(null, user);
        } else {
          // User not found, create a new user
          const newUser = {
            id: faker.string.uuid(), // Generate a new unique ID
            googleId: profile.id,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null, // Store the primary email
            displayName: profile.displayName,
            firstName: profile.name && profile.name.givenName ? profile.name.givenName : '',
            lastName: profile.name && profile.name.familyName ? profile.name.familyName : '',
            picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            // You might want to mark this user as verified if they authenticated via Google
            isVerified: true,
          };

          users.push(newUser);
          writeData(usersFilePath, users);
          return done(null, newUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
