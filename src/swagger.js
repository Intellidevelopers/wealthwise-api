// src/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wealthwise API',
      version: '1.0.0',
      description: 'API documentation for Wealthwise LMS Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Change this in production
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your route files with Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
