function authorizeRole(isAdminRequired) {
  return (req, res, next) => {
    if(isAdminRequired && !req.user.is_admin){
      return res.status(403).json({ message: 'Access denied'});
    }
    next();
  };
}

module.exports = { authorizeRole };
