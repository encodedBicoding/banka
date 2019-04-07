import Database from '../models/Database';

const { users, staffs } = Database;

class Profile {
  static clientImageUpload(req, res) {
    const { userId } = req.params;
    const { imageUrl } = req.body;
    const user = users.filter(s => s.id === Number(userId));
    const ext = imageUrl.split('.')[1];
    if (ext === 'jpeg'
        || ext === 'jpg'
        || ext === 'png'
        || ext === 'gif'
    ) {
      user[0].imageUrl = imageUrl;
      res.status(200).json({
        status: 200,
        message: 'Upload success',
        date: user[0],
      });
    } else {
      res.status(406).json({
        status: 406,
        message: 'Invalid image',
      });
    }
  }

  static staffImageUpload(req, res) {
    const { staffId } = req.params;
    const { imageUrl } = req.body;
    const staff = staffs.filter(s => s.id === Number(staffId));
    const ext = imageUrl.split('.')[1];
    if (ext === 'jpeg'
        || ext === 'jpg'
        || ext === 'png'
        || ext === 'gif'
    ) {
      staff[0].imageUrl = imageUrl;
      res.status(200).json({
        status: 200,
        message: 'Upload success',
        date: staff[0],
      });
    } else {
      res.status(406).json({
        status: 406,
        message: 'Invalid image',
      });
    }
  }
}

export default Profile;
