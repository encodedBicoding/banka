const database = require('../models/database'),
      auth = require('../helpers/auth'),
      util = require('../helpers/util'),
      Client = require('../models/Client'),
      Admin = require("../models/Admin"),
      Staff = require("../models/Staff");

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    database.Users.map(user=>{
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
    database.Staffs.map(staff=>{
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
     let token = auth.generateToken({firstname, email, pass});
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
        const {firstname, email, type, password } = req.body;
        let staff = database.Staffs.filter(staff => staff.email === email );
        if(staff.length <= 0){
            if(type === 'staff'){
                let id = 0;
                let newStaff = new Staff(firstname, email, type, password);
                newStaff.id = id + 1;
                database.Staffs.push(newStaff);
                res.status(200).json({
                    status: 200,
                    message: newStaff
                })
            } else if(type === 'admin'){
                let id = 0;
                let newAdmin = new Admin(firstname, email, type, password);
                newAdmin.id = id + 1;
                database.Staffs.push(newAdmin);
                res.status(200).json({
                    status: 200,
                    message: newAdmin

                })
            }

        }else if(staff[0].email === email){
            res.status(401).json({
                status: 401,
                message: 'Email already exists'
            })
        }
};

module.exports = { addToDataBase,
                   checkUserExists,
                   validateLogin,
                   validateAdminLogin,
                   addAdmin};