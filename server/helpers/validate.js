const Staffs = require('../models/database').Staffs,
      Users = require('../models/database').Users;
module.exports = {
    validateStaff: (req, res, next) => {
        let { staff_id } = req.params;
        let staff = Staffs.filter(staff => staff.id === Number(staff_id) && staff.isAdmin === true);
        if (staff.length <= 0) {
            res.status(401).json({
                status: 401,
                message: 'Not Authorized'
            });
        }else  {
            next();
        }
    },
    validateAdmin: (req, res, next) => {
        let { staff_id } = req.params;
        let staff = Staffs.filter(staff => staff.id === Number(staff_id) && staff.type === 'admin');
        if (staff.length <= 0) {
            res.status(401).json({
                status: 401,
                message: 'Not Authorized'
            });
        } else {
            next();
        }
    },
    validateUser: (req, res, next) => {
        let { user_id } = req.params;
        let user = Users.filter(client => client.id === Number(user_id) && client.type === 'client');
        if (user.length <= 0) {
            res.status(401).json({
                status: 401,
                message: 'Not Authorized'
            });
        } else{
            next();
        }
    }
};