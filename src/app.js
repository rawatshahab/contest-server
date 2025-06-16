const express = require('express');
const cors = require('cors');
const session  = require('express-session');
const MongoStore = require("connect-mongo")(session);
const app = express();
const {mountRoutes} = require("../src/routes/index");
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    secure: process.env.NODE_ENV === "production", // only over HTTPS
    httpOnly: true,    // JS can’t read it
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10  // e.g. 10 years
  }
}));
mountRoutes(app);
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);

    // Default error
    let error = {
        success: false,
        message: 'Internal Server Error',
        status: 500
    };

    // Handle different types of errors
    if (err.name === 'ValidationError') {
        error.status = 400;
        error.message = 'Validation Error';
        error.details = err.message;
    } else if (err.name === 'CastError') {
        error.status = 400;
        error.message = 'Invalid ID format';
    } else if (err.code === 11000) {
        error.status = 409;
        error.message = 'Duplicate entry';
    } else if (err.status) {
        error.status = err.status;
        error.message = err.message;
    } else if (err.message) {
        error.message = err.message;
    }

    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production') {
        delete error.stack;
    } else {
        error.stack = err.stack;
    }

    res.status(error.status).json(error);
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});


module.exports = app;