	
 const {Storage} = require('@google-cloud/storage');
  const path = require('path');
  const GOOGLE_CLOUD_PROJECT_ID = "zinc-shard-255213"; // Replace with your project ID
  const GOOGLE_CLOUD_KEYFILE =  path.join(__dirname,"../../My_First_Project-06041b7391da.json"); // Replace with the path to the downloaded private key
  
  const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });
  exports.storage = storage;

  exports.getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`


