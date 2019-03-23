const express = require('express'),
      validate = require('../config/validateUser');

module.exports = (app)=>{
    app.get('/', (req, res)=>{
        res.status(200).json({
            status: 200,
            message: 'Welcome to Banka'
        })
    });
    app.post('/api/v1/auth/login',
        validate.validateLogin );

   app.post('/api/v1/auth/signup',
                validate.checkUserExists,
                validate.addToDataBase);



    app.use((req, res)=>{
        res.status(404).json({
            status: 404,
            message: 'no such endpoints on this server'
        })
    });
    app.use(express.Router())
}
