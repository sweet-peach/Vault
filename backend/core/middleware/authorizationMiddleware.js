import jwt from "jsonwebtoken";

function authorizationMiddleware(req, res, next){
    if(req.method === "OPTIONS"){
        return next();
    }
    const cookies = req.headers.cookie;
    function getCookieValue(cookieName) {
        if (!cookies) return null;

        const cookieArray = cookies.split(';');

        for (let cookie of cookieArray) {
            const [name, value] = cookie.split('=').map(part => part.trim());
            if (name === cookieName) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    let token = getCookieValue('token');

    if(!token){
        token = req?.headers?.authorization?.split(' ')[1]
    }
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