const allowRoles = (...roles) => {
    return (req, res, next) => {
      const user = req.session.user;
      if (user && roles.includes(user.role)) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    };
  };
  
  module.exports = { allowRoles };
  