import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if(!token) return res.redirect("/login");
   try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role != "admin") return res.redirect("/login");
    req.user = decoded;
    next();
   }catch(err){
    console.error("Invalid token:", err.message);
    res.redirect("/login");
   }
}
