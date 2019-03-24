const auth = require('./auth');

module.exports = {
    validateSession: (req, res, next)=>{
        console.log(req);
        let { token } = req.user;
        let payload = auth.verifyToken(token);
        if(typeof payload === 'object'){
            next();
        } else{
            res.status(401).json({
                status: 401,
                message: 'Not authorized to access endpoint'
            })
        }
    },
    validateStaff: (req, res, next)=>{
        let { isAdmin } = req.user;
        if(isAdmin === true){
            next();
        } else{
            res.status(401).json({
                status: 401,
                message: 'Not authorized to access endpoint',
            })
        }
    },
    validateAdmin: (req, res, next)=>{
        let { type } = req.user;
        if(type === 'admin'){
            next();
        } else {
            res.status(401).json({
                status: 401,
                message: 'Not authorized to access endpoint'
            })
        }
    }
}