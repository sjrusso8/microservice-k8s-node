/**
 * Import npm packages
 */

const express = require("express");
const azure = require("azure-storage");

const app = express();

//
// Throws an error if the any required environment variables are missing.
//

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

if (!process.env.STORAGE_ACCOUNT_NAME) {
  throw new Error(
    "Please specify the name of an Azure storage account in environment variable STORAGE_ACCOUNT_NAME."
  );
}

if (!process.env.STORAGE_ACCESS_KEY) {
  throw new Error(
    "Please specify the access key to an Azure storage account in environment variable STORAGE_ACCESS_KEY."
  );
}

const PORT = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

// Create a blob service API
function createBlobService() {
  const blobService = azure.createBlobService(
    STORAGE_ACCOUNT_NAME,
    STORAGE_ACCESS_KEY
  );
  return blobService;
}

app.get("/video", (req, res) => {
  const videoPath = req.query.path;
  console.log(`Streaming video from ${videoPath}`);

  const blobService = createBlobService();

  const containerName = "videos";
  blobService.getBlobProperties(containerName, videoPath, (err, properties) => {
    if (err) {
      console.error(
        `Error occured.  Some BS happened during connection for video ${containerName}/${videoPath}`
      );
      console.error(err & err.stack || err);
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, {
      "Content-Length": properties.contentLength,
      "Content-Type": "video/mp4",
    });

    blobService.getBlobToStream(containerName, videoPath, res, (err) => {
      if (err) {
        console.error(
          `Error occured.  Some BS happened during streaming for video ${containerName}/${videoPath}`
        );
        console.error(err & err.stack || err);
        res.sendStatus(500);
        return;
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Azure Storage Microservice Online`);
});
