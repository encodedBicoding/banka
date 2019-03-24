const Staffs = require('../models/database').Staffs;

module.exports = {
    validateStaff: (req, res, next) => {
        let id = req.params.staff_id;
        Staffs.map((staff) => {
            if (staff.id === Number(id) && staff.isAdmin === true) {
                next();
            } else {
                res.status(401).json({
                    status: 401,
                    message: 'Not authorized to access endpoint',
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
                    message: 'Not authorized to access endpoint',
                })
            }
        })
    }
};