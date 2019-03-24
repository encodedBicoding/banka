const auth = require('../helpers/auth'),
      database = require('../models/database');


module.exports = {
    index: (req, res)=>{
        res.status(200).json({
            status: 200,
            message: 'Welcome to the login page'
        })
    },
    login: (req, res)=>{
        const {email, password} = req.body;
        let token = auth.generateToken({email, password});
        database.Users.map((user)=>{
            if(user.email === email){
                user.token = token;
                req.user = user
                res.status(200).json({
                    status: 200,
                    token,
                    data: user,
                })
            }
        });
    }
};