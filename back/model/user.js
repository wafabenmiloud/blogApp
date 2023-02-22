const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

const User = mongoose.model("users", userSchema);

//register body validation
const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

//login body validation
const validatee = (data) => {
	const schema = Joi.object({
	  email: Joi.string().email().required().label("Email"),
	  password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
  };

module.exports = { User, validate, validatee };