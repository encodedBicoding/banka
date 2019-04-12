"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var upload = (0, _multer["default"])({
  dest: './UI/public/uploads/temp/'
});
/**
 * @class Profile
 */

var Profile =
/*#__PURE__*/
function () {
  function Profile() {
    _classCallCheck(this, Profile);
  }

  _createClass(Profile, null, [{
    key: "imageUpload",

    /**
     * @description uploads a single image to user profile
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */
    value: function imageUpload(req, res) {
      var file = upload.single('user_img');
      file(req, res, function (err) {
        if (err) {
          res.status(400).json({
            status: 400
          });
        } else {
          var imgUrl = "banka-img-".concat(Math.floor(Math.random() * 93283));
          var tempPath = req.file.path;

          var ext = _path["default"].extname(req.file.originalname).toLowerCase();

          var targetPath = _path["default"].resolve("./UI/public/uploads/".concat(imgUrl).concat(ext));

          if (ext === '.png' || ext === '.jpeg' || ext === '.gif' || ext === '.jpg') {
            _fs["default"].rename(tempPath, targetPath, function (err) {
              if (err) throw err;
              res.status(200).json({
                status: 200,
                data: "".concat(imgUrl).concat(ext)
              });
            });
          } else {
            _fs["default"].unlink(tempPath, function (err) {
              if (err) throw err;
              res.status(500).json({
                status: 500,
                message: 'Only image files are allowed'
              });
            });
          }
        }
      });
    }
  }]);

  return Profile;
}();

var _default = Profile;
exports["default"] = _default;