const express = require('express');
const cors = require('cors');

// ===== CONTROLLERS =====

const { globalErrorHandler } = require('./utils/globalErrorHandler');

// ===== INIT EXPRESS APP =====

const app = express();

// ===== ENABLE CORS =====

app.use(cors());

// ===== ENABLE INCOMING JSON DATA =====

app.use(express.json());

// ===== ROUTERS =====

const { usersRouter } = require('./components/users/users.Routes');
const {
  restaurantsRouter,
} = require('./components/restaurants/restaurants.Routes');
const { mealsRouter } = require('./components/meals/meals.Routes');
const { ordersRouter } = require('./components/orders/orders.Routes');
const {
  restaurantsReviewsRouter,
} = require('./components/restaurantsReviews/restaurantsReviews.Routes');

// ===== ENDPOINTS =====

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/restaurants', restaurantsRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);

app.use('/api/v1/reviews', restaurantsReviewsRouter);

// ===== GLOBAL ERROR HANDLER

app.use('*', globalErrorHandler);

module.exports = { app };
