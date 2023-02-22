//const dotenv = require("dotenv");
//dotenv.config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, validate, validatee } = require("../model/user");

const signupUser = async (req, res) => {
  try {
    //validation
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    //email exist or not
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });
    }

    //hash password
    const salt = await bcrypt.genSalt(Number(10));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //save user to db
    const savedUser = await new User({
      ...req.body,
      password: hashPassword,
    }).save();

    //sign token
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      "@ug9;Uhr(mUDN',*%Na+h/UqF5]Ab9bnC~&5U7Cm92gD\{4QM*"
    );

    // send token in a cookie
    res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
      })
      .status(201)
      .send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const signinUser = async (req, res) => {
  try {
    //validation
    const { error } = validatee(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    //if account not found
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    //if password incorrect
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!passwordCorrect) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // sign the token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      "@ug9;Uhr(mUDN',*%Na+h/UqF5]Ab9bnC~&5U7Cm92gD\{4QM*"
    );

    // send the token in a HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
      })
      .send({ message: "logged in" });
      
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: false,
      expires: new Date(0),
      secure: false,
    })
    .send();
};

const authenticateToken = (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.json(false);
    }
    jwt.verify(token, "@ug9;Uhr(mUDN',*%Na+h/UqF5]Ab9bnC~&5U7Cm92gD\{4QM*", {}, async (err, info) => {
      if (err) throw err;
      const user = {
        logged : true,
        data: info
      }
      res.json(user)
    });

  } catch (err) {
    res.json(err);
  }
  
};

module.exports = {
  signupUser,
  signinUser,
  logout,
  authenticateToken,
};
