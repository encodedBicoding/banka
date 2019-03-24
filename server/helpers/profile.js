const database = require('../models/database');
module.exports = {
    clientImageUpload: (req, res)=>{
        let userId = req.params.user_id;
        let imageUrl = req.body;
        database.Users.map((user)=>{
            if(user.id === Number(userId)){
                user.imageUrl = imageUrl;
            }
        })
    },
    staffImageUpload: (req, res)=>{
        let staffId = req.params.staff_id;
        let imageUrl = req.body;
        database.Staffs.map((staff)=>{
            if(staff.id === Number(staffId)){
                staff.imageUrl = imageUrl;
            }
        })
    }

}