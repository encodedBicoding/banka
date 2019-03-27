const database = require('../models/database'),
      auth = require('../helpers/auth'),
      util = require('../helpers/util'),
      Client = require('../models/Client'),
      Admin = require("../models/Admin"),
      Staff = require("../models/Staff");
module.exports = {
    validateLogin: (req, res, next) => {
        const { email, password } = req.body;
        let user = database.Users.filter( user => user.email === email
                                        && (util.validatePassword(password, user.password)));
        (user.length <= 0)?res.status(404).json({status: 404, message: 'email or password not found'}):next();
    },
    validateAdminLogin: (req, res, next) => {
        const { email, password } = req.body;
        let staff = database.Staffs.filter( staff => staff.email === email
            && (util.validatePassword(password, staff.password)));
        (staff.length <= 0)?res.status(404).json({status: 404, message: 'email or password not found'}):next();
    },
    checkUserExists: (req, res, next) => {
        const { email } = req.body;
        let found = database.Users.find(user => user.email === email);
        (typeof found !== "object")?next():
            res.status(401).json({status:401, message:  'A user with the given email already exists'})
    },
    addToDataBase: (req, res) => {
        let { firstname, email, password, lastname } = req.body;
        let id = database.Users.length + 1;
        let pass = util.hashPassword(password);
        let token = auth.generateToken({ pass, email, firstname } );
        let user = new Client(firstname, email, pass, lastname);
        user.token = token;
        req.user = user;
        user.id = id++;
        database.Users.push(user);
        res.status(200).json({
            status: 200,
            message: 'Account created successfully',
            user });
    },
    addAdmin: (req, res) => {
        const { firstname, email, type, password } = req.body;
        let staff = database.Staffs.filter(staff => staff.email === email);
        if (staff.length <= 0) {
            if (type === 'staff') {
                let id = 0;
                let newStaff = new Staff(firstname, email, type, password);
                newStaff.id = id + 1;
                database.Staffs.push(newStaff);
                res.status(200).json({
                    status: 200,
                    message: newStaff
                });
            } else if (type === 'admin') {
                let id = 0;
                let newAdmin = new Admin(firstname, email, type, password);
                newAdmin.id = id + 1;
                database.Staffs.push(newAdmin);
                res.status(200).json({
                    status: 200,
                    message: newAdmin });
            }
        } else {
            res.status(401).json({
                status: 401,
                message: 'Email already exists'
            });
        }
    },
    signupInputField: (req, res, next) => {
        const { firstname, email, lastname, password } = req.body;
        let nameTest = /^[A-z]{3,20}$/,
            emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/,
            passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
        if (!nameTest.test(firstname) || !nameTest.test(lastname) || !emailTest.test(email) || !passText.test(password)) {
            res.status(403).json({
                status: 403,
                message: 'Please check that all field are filled'
            });
        } else {
            next();
        }
    }
};