// authMiddleware.js
import jwt from "jsonwebtoken";
import { secret } from "../../config.js";
const public_urls = ["/auth/login", "/auth/register", "/auth/verify"];
const user_urls = ["/orders/make_order"];
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const route = req.path;
  console.log(route);
  if (public_urls.includes(route)) {
    next();
    return;
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach user information to the request for further use in routes
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
    console.log("done", token);
  });
};

export const authorized = async (req, res, next) => {
  const user = jwt.decode(req.headers.authorization);
  console.log(user);

  const is_admin = user?.is_admin;
  const route = req.path;

  if (public_urls.includes(route)) {
    next();
  } else if (user_urls.includes(route) && !is_admin && user.is_verified) {
    next();
  } else if (is_admin) {
    next();
  } else res.status(500).send("you are not authorized to this url");
};

export default authMiddleware;
