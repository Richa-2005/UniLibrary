
//to check if the JWT the request is sending is correct according to the JWT key or not
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  // 1. Check for the token in the 'Authorization' header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get token from header (it looks like "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user's data to the request object
      // This payload is what we put in at login: { universityId: '...' }
      req.user = decoded; 

      // 5. Call the next middleware/route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};