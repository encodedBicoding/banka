const express = require('express'),
      router = express.Router();
      //authenticateUser = require('../config/authenticateUser');

module.exports = (app)=>{
    app.get('/', (req, res)=>{
        res.status(200).json({
            status:  200,
            message: 'Welcome to Banka',
        })
    })
    app.use(router)
}
