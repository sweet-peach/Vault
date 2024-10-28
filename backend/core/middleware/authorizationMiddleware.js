import jwt from "jsonwebtoken";

function authorizationMiddleware(req, res, next){
    if(req.method === "OPTIONS"){
        return next();
    }

    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        return res.status(401).json({message: 'Authorization error'})
    }

    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        return res.status(401).json({message: 'Authorization error'})
    }
}

export default authorizationMiddleware;