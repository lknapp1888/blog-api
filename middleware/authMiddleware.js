

const userCheck = (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).json({
            status: "fail",
            error: "unauthorized",
            message: "User not logged in or session expired. Please log in to access this resource.",
          });  
          return            
    }
    next()
}
const adminCheck = (req, res, next) => {
    if (!req.user.admin) {
        res.status(401).json({
            status: "fail",
            error: "unauthorized",
            message: "User is not administrator. Please log in to access this resource.",
          });  
          return            
    }
    next()
  };

  module.exports = { userCheck, adminCheck }