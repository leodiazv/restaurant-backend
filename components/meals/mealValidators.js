const { body, validationResult } = require('express-validator');

// ===== VALIDATIONS =====

const createMealValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Address cannot be empty')
    .isInt()
    .withMessage('Price must be integred'),
];

// ===== CHECK VALIDATIONS =====

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);
    //En la anterior linea de desestructura msg de error y permite hacer un return implicito

    const errorMsg = messages.join('. ');
    //En la anterior variable convertimos el array de mensajes en un solo string, separados por un punto y un espacio.

    return res.status(400).json({
      status: 'error',
      message: errorMsg,
    });
  }

  next();
};

module.exports = { createMealValidations, checkValidations };
