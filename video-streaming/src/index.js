const express = require("express");
const http = require("http");
const mongodb = require("mongodb");

const app = express();

//
// Throws an error if the any required environment variables are missing.
//

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

if (!process.env.VIDEO_STORAGE_HOST) {
  throw new Error(
    "Please specify the host name for the video storage microservice in variable VIDEO_STORAGE_HOST."
  );
}

if (!process.env.VIDEO_STORAGE_PORT) {
  throw new Error(
    "Please specify the port number for the video storage microservice in variable VIDEO_STORAGE_PORT."
  );
}

//
// Extracts environment variables to globals for convenience.
//
const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;
console.log(
  `Forwarding video requests to ${VIDEO_STORAGE_HOST}:${VIDEO_STORAGE_PORT}.`
);


function main() {
  return mongodb.MongoClient.connect(DBHOST)
    .then(client => {
      const db = client.db(DBNAME);
      const videoCollection = db.collection("videos")

      app.get("/video", (req, res) => {
        const videoId = new mongodb.ObjectID(req.query.id);
        videoCollection
          .findOne({ _id: videoId })
          .then(videoRecord => {
            if (!videoRecord) {
              res.sendStatus(404);
              return;
            }

            console.log(`Translated id ${videoId} to path ${videoRecord.videoPath}.`);

            const forwardRequest = http.request(
              // Forward the request to the video storage microservice.
              {
                host: VIDEO_STORAGE_HOST,
                port: VIDEO_STORAGE_PORT,
                path: `/video?path=${videoRecord.videoPath}`, // Video path is hard-coded for the moment.
                method: "GET",
                headers: req.headers
              },
              forwardResponse => {
                res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
                forwardResponse.pipe(res);
              }
            );

            req.pipe(forwardRequest);
          })
          .catch(err => {
            console.error("DB query failed.");
            console.error(err && err.stack || err);
            res.sendStatus(500);
          });
      });
      app.listen(PORT, () => {
        console.log(`Microservice online: Everything seems okay`);
      });
    });
}

main()
  .then(() => console.log("Microservice online"))
  .catch(err => {
    console.error("Microservice failed to start.");
    console.error(err && err.stack || err);
  })