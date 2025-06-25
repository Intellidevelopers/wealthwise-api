const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Adjust path if needed

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // <-- Mount Swagger

const cors = require('cors');
app.use(cors());

app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/courses', require('./routes/course.routes'));
// app.use('/api/enrollments', require('./routes/enrollment.routes'));

app.get('/', (req, res) => res.send('Wealthwise LMS API is running ✅'));

module.exports = app;
