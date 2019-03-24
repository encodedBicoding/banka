const jwt = require('jsonwebtoken'),
            secretKey = 'catsanddogs';

function generateToken(payload){
    const token = jwt.sign(payload, secretKey, {expiresIn: '1 week'});
    return token;
}
function verifyToken(token){
    try{
        const payload = jwt.verify(token, secretKey);
        return payload;
    } catch (e) {
        return {error: `${e}`}
    }
}

module.exports =  { generateToken, verifyToken}