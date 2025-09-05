const express = require('express');
const cors = require('cors');
const { connect } = require('./db'); // Assuming you have a 'connect' function to handle DB connection
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const eventCategoriesRouter = require('./routes/eventCategories');
const eventsRouter = require('./routes/events');
const assignmentsRouter = require('./routes/assignments');
const examsRouter = require('./routes/exams');
const loginRouter = require('./routes/login');  // Assuming you have a login route

const app = express();

// Middleware to enable CORS and parse JSON requests
app.use(cors());
app.use(express.json());

// Database connection and route setup
connect().then(() => {
  // Register routes
  app.use('/api/users', usersRouter);
  app.use('/api/login', loginRouter);  // Login route
  app.use('/api/courses', coursesRouter);
  app.use('/api/eventCategories', eventCategoriesRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/assignments', assignmentsRouter);
  app.use('/api/exams', examsRouter);

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
