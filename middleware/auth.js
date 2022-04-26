import jwt from 'jsonwebtoken';

const auth = async (req, res,next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(403)
      .json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    

    req.userID = decoded?.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message,isAuthenticated:false,auth:null });
  }
};

export default auth;
