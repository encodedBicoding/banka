const Staffs = require('../models/database').Staffs,
       Users = require('../models/database').Users;

module.exports = {
    validateStaff: (req, res, next) => {
        let id = req.params.staff_id;
        Staffs.map((staff) => {
            if (staff.id === Number(id) && staff.isAdmin === true) {
                next();
            } else {
                res.status(401).json({
                    status: 401,
                    message: 'Not Authorized',
                })
            }
        })
    },
    validateAdmin: (req, res, next) => {
        let id = req.params.staff_id;
        Staffs.map((staff) => {
            if (staff.id === Number(id) && staff.type === 'admin') {
                next();
            } else {
                res.status(401).json({
                    status: 401,
                    message: 'Not Authorized',
                })
            }
        })
    },
    validateUser: (req, res, next) => {
        let id = req.params.user_id;
        Users.map((user) => {
            if (user.id === Number(id) && user.type === 'client') {
                next();
            } else {
                res.status(401).json({
                    status: 401,
                    message: 'Not Authorized',
                })
            }
        })
    },
};