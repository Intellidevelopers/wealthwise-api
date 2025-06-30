require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger'); // Adjust path if needed
const notificationRoutes = require('./routes/notification.routes');
const messageRoutes = require('./routes/message.routes');
const paymentRoutes = require('./routes/payment.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const quizRoutes = require('./routes/quize.routes');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // <-- Mount Swagger
app.use('/uploads', express.static('uploads'));

const cors = require('cors');
app.use(cors());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/notifications', notificationRoutes);
app.use('/api/instructor', require('./routes/instructor.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));
app.use('/api/messages', messageRoutes);
// app.js or server.js
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/payment', paymentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);


app.get('/', (req, res) => res.send('Wealthwise LMS API is running ✅'));

module.exports = app;
