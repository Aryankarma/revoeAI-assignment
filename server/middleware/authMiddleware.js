import pkg from 'jsonwebtoken';
const { verify } = pkg;

const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');

    console.log("authHeader: ", authHeader)

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        console.log("consoling user: ", req.user)
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default protect;