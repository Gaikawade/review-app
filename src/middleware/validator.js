const { check, validationResult } = require("express-validator");

const userValidator = [
    check("name").trim().not().isEmpty().withMessage("Name is missing"),
    check("email").normalizeEmail().isEmail().withMessage("Email is invalie"),
    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be 8 to 20 characters long"),
];

const validate = (req, res, next) => {
    const err = validationResult(req).array();
    if (err.length) {
        return res.status(400).json({ error: err[0].msg });
    }
    next();
};

module.exports = {
  userValidator,
  validate
}