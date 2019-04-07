import fs from 'fs';
import path from 'path';
import multer from 'multer';


const upload = multer({ dest: './UI/public/uploads/temp/' });


class Profile {
  static imageUpload(req, res) {
    const file = upload.single('user_img');
    file(req, res, (err) => {
      if (err) {
        res.status(400).json({
          status: 400,
        });
      } else {
        const imgUrl = `banka-img-${Math.floor(Math.random() * 93283)}`;
        const tempPath = req.file.path;
        const ext = path.extname((req.file.originalname)).toLowerCase();
        const targetPath = path.resolve(`./UI/public/uploads/${imgUrl}${ext}`);
        if (ext === '.png' || ext === '.jpeg' || ext === '.gif' || ext === '.jpg') {
          fs.rename(tempPath, targetPath, (err) => {
            if (err) throw err;
            res.status(200).json({
              status: 200,
              data: `${imgUrl}${ext}`,
            });
          });
        } else {
          fs.unlink(tempPath, (err) => {
            if (err) throw err;
            res.status(500).json({
              status: 500,
              message: 'Only image files are allowed',
            });
          });
        }
      }
    });
  }
}

export default Profile;
