const database = require('../models/database');
module.exports = {
    clientImageUpload: (req, res) => {
        let userId = req.params.user_id;
        let { imageUrl } = req.body;
        database.Users.map(user => {
            if (user.id === Number(userId)) {
                let ext = imageUrl.split(".")[1];
                if (ext === "jpeg" || ext === "jpg" || ext === "png" || ext === "gif") {
                    user.imageUrl = imageUrl;
                    res.status(200).json({
                        status: 200,
                        message: 'Upload success',
                        date: user
                    });
                } else {
                    res.status(406).json({
                        status: 406,
                        message: 'Invalid image'
                    });
                }
            }
        });
    },
    staffImageUpload: (req, res) => {
        let staffId = req.params.staff_id;
        let { imageUrl } = req.body;
        database.Staffs.map(staff => {
            if (staff.id === Number(staffId)) {
                let ext = imageUrl.split(".")[1];
                if (ext !== 'jpeg' || ext !== 'jpg' || ext !== 'png') {
                    res.status(406).json({
                        status: 406,
                        message: 'Invalid image type'
                    });
                } else {
                    staff.imageUrl = imageUrl;
                    res.status(200).json({
                        status: 200,
                        message: 'Upload success'
                    });
                }
            }
        });
    }

};