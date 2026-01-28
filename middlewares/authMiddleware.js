const isAuthenticated = (req, res, next) => {
  process.nextTick(() => {
    if (req.user) {
      next();
    } else {
      res.redirect("/login");
    }
  });
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/todos");
  }
};

module.exports = { isAuthenticated, isNotAuthenticated };