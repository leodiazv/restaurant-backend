// ===== MODELS =====

const { Order } = require('./orderModel');

// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// =================

const orderExists = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({
    where: { id: orderId, status: 'active' },
  });

  if (!order) {
    return next(new AppError('Order does not exist with given Id', 404));
  }

  // Add user data to the req object

  req.order = order;

  next();
});

module.exports = { orderExists };
