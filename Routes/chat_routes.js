const express = require("express");
const router = express.Router();
const LoginValidator = require("../Validations/LoginValidator");
const RegisterValidator = require("../Validations/RegisterValidator");
const {checkUser, loginUser} = require("../Controllers/UserController");
