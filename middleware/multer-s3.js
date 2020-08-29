const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { AWS_SECRET_ACCESS, AWS_ACCESS_KEY, S3_BUCKET_NAME} = require('../config/amazon');

const nanoId = require('nanoid').nanoid(11);
const { fileFilter } = require('../helper/validate-upload');

aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS,
    accessKeyId: AWS_ACCESS_KEY,
    region: 'us-east-1'
})

const s3 = new aws.S3();

const upload = multer({
    fileFilter: fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        serverSideEncryption: 'AES256',
        key: function (req, file, cb) {
          cb(null, nanoId)
        }
    })
})

module.exports = upload;