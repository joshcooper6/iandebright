const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACC_KEY,
    secretAccessKey: process.env.SEC_ACC_KEY,
  });

async function getS3Images() {
    const params = {
      Bucket: "iandebucket",
    };
  
    const data = await s3.listObjectsV2(params).promise();

    const images = data.Contents.map((image) => {
      return `https://${params.Bucket}.s3.us-west-2.amazonaws.com/${image.Key}`
    })

    return images;
};

module.exports = { getS3Images };