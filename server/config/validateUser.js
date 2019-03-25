const database = require('../models/database'),
      auth = require('../helpers/auth'),
      util = require('../helpers/util'),
      Client = require('../models/Client'),
      Admin = require("../models/Admin"),
      Staff = require("../models/Staff");

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    database.Users.map((user)=>{
        if((user.email !== email) || user.password !== password){
            res.status(404).json({
                status: 404,
                message: 'email or password not found'
            });
        } else{
            next();
        }
    })
};
const validateAdminLogin = (req, res, next) => {
    const { email, password } = req.body;
    database.Staffs.map((staff)=>{
        if((staff.email !== email) || staff.password !== password){
            res.status(404).json({
                status: 404,
                message: 'email or password not found'
            });
        } else{
            next();
        }
    })
}

const checkUserExists = (req, res, next)=>{
    const { email } = req.body;
    let found = database.Users.find( user=>user.email === email);
    if(typeof found !== "object") {
        next();
    } else {
        res.status(401).json({
            status: 401,
            message: 'A user with the given email already exists'
        })
    }
}

const addToDataBase = (req, res)=>{
     let {firstname, email, password, username} = req.body;
     let id = database.Users.length + 1;
     let pass = util.hashPassword(password);
     let token = auth.generateToken({firstname, email, pass})
     let user = new Client(firstname, email, pass, username);
     user.token = token;
     req.user = user;
     user.id = id++;
     database.Users.push(user);
     res.status(200).json({
         status: 200,
         message: 'Account created successfully',
         user,
     })
};
const addAdmin = (req, res)=>{
        const { firstname, email, type, password } = req.body;
        database.Staffs.map((staff)=>{
            if(staff.email !== email){
                if(type === 'admin'){
                    let admin = new Admin(firstname, email, password);
                    database.Staffs.push(admin);
                    res.status(200).json({
                        status: 200,
                        data: admin
                    })
                } else if( type === 'staff'){
                    let staff = new Staff(firstname, email, password);
                    database.Staffs.push(staff);
                    res.status(200).json({
                        status: 200,
                        data: staff
                    })
                }
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'Email already exists! '
                })
            }
        })
}

module.exports = { addToDataBase,
                   checkUserExists,
                   validateLogin,
                   validateAdminLogin,
                   addAdmin};