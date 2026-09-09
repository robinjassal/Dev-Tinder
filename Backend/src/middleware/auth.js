const adminAuth = (req, res, next) => {
  //Check if the request is authourised
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  //Check if the request is authourised
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
