const { app } = require('./app');

// ===== MODELS =====

const { Meal } = require('./components/meals/mealModel');
const { Order } = require('./components/orders/orderModel');
const { Restaurant } = require('./components/restaurants/restaurantModel');
const {
  RestaurantReview,
} = require('./components/restaurantsReviews/restaurantReviewModel');
const { User } = require('./components/users/userModel');

// ===== UTILS =====

const { db } = require('./utils/database');

// ===== DATABASE CONECCTION

db.authenticate()
  .then(() => console.log('Database authenticate :)'))
  .catch((err) => console.log(err));

db.sync()
  .then(() => console.log('Database synced :)'))
  .catch((err) => console.log(err));

// ===== ESTABLISH MODELS RELATIONS =====

Restaurant.hasMany(Meal);
Meal.belongsTo(Restaurant);

/* Order.hasOne(Meal);
Meal.belongsTo(Order); */

Meal.hasOne(Order);
Order.belongsTo(Meal);

User.hasOne(Order);
Order.belongsTo(User);

User.hasMany(RestaurantReview);
RestaurantReview.belongsTo(User);

Restaurant.hasMany(RestaurantReview);
RestaurantReview.belongsTo(Restaurant);

// ===== SPIN UP SERVER =====

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}! :)`);
});
