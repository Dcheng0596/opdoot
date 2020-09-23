const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { AWS_SECRET_ACCESS, AWS_ACCESS_KEY, S3_BUCKET_NAME, S3_BUCKET_REGION} = require('../config/amazon');

const nanoId = require('nanoid');
const idLength = 11;

aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS,
    accessKeyId: AWS_ACCESS_KEY,
    region: S3_BUCKET_REGION
})

const s3 = new aws.S3();

const upload_post = multer({
    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        serverSideEncryption: 'AES256',
        key: function (req, file, cb) {
          cb(null, nanoId.nanoid(idLength))
        }
    })
})

const upload_profile_picture = multer({
    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        serverSideEncryption: 'AES256',
        key: function (req, file, cb) {
          cb(null,'users/' + nanoId.nanoid(idLength))
        }
    })
})



exports.upload_post = upload_post;

exports.upload_profile_picture = upload_profile_picture;

exports.s3 = s3;