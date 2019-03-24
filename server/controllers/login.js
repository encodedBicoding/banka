const auth = require('../helpers/auth'),
      database = require('../models/database');


module.exports = {
    index: (req, res)=>{
        console.log(req)
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
                req.user = user;
                console.log(req);
                res.status(200).json({
                    status: 200,
                    token,
                    data: user,
                })
            }
        });
    },
    adminLogin: (req, res)=>{
        const {email, password} = req.body;
        let token = auth.generateToken({email, password});
        database.Staffs.map((staff)=>{
            if(staff.email === email){
                staff.token = token;
                req.user = staff;
                res.status(200).json({
                    status: 200,
                    token,
                    data: staff,
                })
            }
        });
    }
};