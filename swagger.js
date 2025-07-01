const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wealthwise LMS Backend API Documentation 🎊',
      version: '1.0.0',
      description: 'API documentation for Wealthwise LMS Backend',
      contact: {
        name: 'Adeagbo Josiah',
        email: 'adeagbojosiah@gmail.com', // Optional: replace with your actual email
        url: 'https://github.com/intellidevelopers' // Optional: GitHub or personal site
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://wealthwise-api.onrender.com', // Change this in production
        description: 'Production Server'
      }
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;