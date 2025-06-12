/**
 * @fileoverview Script to generate mock user and post data for the application.
 * Uses @faker-js/faker to create realistic-looking data.
 */

const { faker } = require('@faker-js/faker');
const { writeData } = require('../utils/fileUtils'); // Adjusted path assuming scripts is at the root

/**
 * Generates mock users and posts and writes them to their respective JSON files.
 */
function generateMockData() {
  const users = [];
  const numUsers = 5;

  console.log('Generating mock users...');
  for (let i = 0; i < numUsers; i++) {
    const user = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      // For simplicity in testing, using a common password.
      // In a real scenario, ensure this is handled securely if ever used beyond pure mocking.
      password: 'password123',
    };
    users.push(user);
  }
  writeData('./data/users.json', users);
  console.log(`${numUsers} mock users generated and saved to data/users.json`);

  const posts = [];
  const numPosts = 5; // Or any number of posts you want

  console.log('Generating mock posts...');
  for (let i = 0; i < numPosts; i++) {
    if (users.length === 0) {
        console.error("Cannot generate posts without users. Please ensure users are generated first or exist.");
        return;
    }
    const post = {
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      // Ensure users array is not empty before trying to access it
      userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
      createdAt: faker.date.past().toISOString(),
    };
    posts.push(post);
  }
  writeData('./data/posts.json', posts);
  console.log(`${numPosts} mock posts generated and saved to data/posts.json`);

  console.log('Mock data generation complete!');
}

generateMockData();
