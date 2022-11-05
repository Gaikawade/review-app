const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const create = async function (req, res) {
    try {
        let details = req.body;
        let { email, password } = details;

        let emailExists = await userModel.findOne({ email });
        if (emailExists) {
            return res
                .status(401)
                .json({ status: false, msg: "Email already registered" });
        }

        details[`password`] = bcrypt.hashSync(password, 10);

        const data = await userModel.create(details);
        res.status(201).json({
            msg: "User created successfully",
            user: data,
        });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};

module.exports = { create };
