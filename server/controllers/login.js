const auth = require('../helpers/auth'),
      database = require('../models/database');

module.exports = {
    index: (req, res) => {
        res.status(200).json({
            status: 200,
            message: 'Welcome to the login page'
        });
    },
    login: (req, res) => {
        const { email, password } = req.body;
        let token = auth.generateToken({ email, password });
        let user = database.Users.filter( user => user.email === email);
        user[0].token = token;
        req.user = user[0];
        res.status(200).json({
            status: 200,
            data: req.user,
        });
    },
    adminLogin: (req, res) => {
        const { email, password } = req.body;
        let token = auth.generateToken({ email, password });
        database.Staffs.map(staff => {
            if (staff.email === email) {
                staff.token = token;
                req.user = staff;
                res.status(200).json({
                    status: 200,
                    token,
                    data: staff
                });
            }
        });
    }
};