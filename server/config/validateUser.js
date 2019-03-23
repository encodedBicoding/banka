const database = require('../models/database'),
      auth = require('../helpers/auth'),
      util = require('../helpers/util'),
      Client = require('../models/Client');

const validateLogin = (req, res) => {
    const { email, password } = req.body;
    database.Users.map((user)=>{
        if((user.email !== email)){
            res.status(404).json({
                status: 404,
                message: 'username or password not found'
            });
        } else if((user.email === email) && (!util.validatePassword(password, user.password))){
            res.status(404).json({
                status: 404,
                message: 'username or password not found'
            });
        }else{
            res.status(200).json({
                status: 200,
                message: 'Login successful'
            });
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
     user.id = id++;
     database.Users.push(user);
     console.log(database.Users)
     res.status(200).json({
         status: 200,
         message: 'Account created successfuly',
         user,
     })
};

module.exports = { addToDataBase, checkUserExists, validateLogin};