import jwt from 'jsonwebtoken';
import 'dotenv';
const authentication = (req, res, next) => {
    const token = req.cookies?.accessToken;
    try {
        if (!token) {
            throw new Error('UNAUTHORIZED');
        }
        const decoded = jwt.verify(token, process.env.ACCESSTOKEN);
        if (!decoded || typeof decoded === 'string') {
            console.log("Hello");
            throw new Error('INVALID_TOKEN');
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new Error('TOKEN_EXPIRED'));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new Error('INVALID_TOKEN'));
        }
        next(error);
    }
};
export default authentication;
