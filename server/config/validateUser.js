const database = require('../models/database'),
      auth = require('../helpers/auth'),
      util = require('../helpers/util'),
      Client = require('../models/Client');

const checkUserExists = (req, res, next)=>{
    const {email, username} = req.body;
    if(email){
        database.Users.map((user)=>{
            if(user.email === email || user.username === username){
                res.status(401).json({
                    status: 401,
                    message: 'A user with the given email or username already exists'
                })
            }
        })
    }
    next();
}
const addToDataBase = (req, res)=>{
    let {firstname, email, password, username} = req.body;
     let pass = util.hashPassword(password);
     let token = auth.generateToken({firstname, email, pass})
     let user = new Client(firstname, email, pass, username);
     user.token = token;
     database.Users.push(user);
     res.status(201).json({
         status: 201,
         message: 'Account created successfully',
         user,
     })
}

module.exports = { addToDataBase, checkUserExists};