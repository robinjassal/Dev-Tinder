const validator = require("validator");
const validationSignupData = (req) => {
  const { firstName, lastName, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("firstname should be 4-50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
};

module.exports = { validationSignupData };
