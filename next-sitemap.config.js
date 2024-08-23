// next-sitemap.config.js

const siteUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://spiral-gadgets.com';

module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true, // (Optional) Generates robots.txt file
  // Add other options if needed
};
