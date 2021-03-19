/**
 * Import npm packages
 */
const express = require("express");
const fs = require("fs");
const path = require("path");

// Gather the Port from the parent container
if (!process.env.PORT) {
  throw new Error(
    "I can't figure out the port number for the HTTP server.  It must be set in the ENV"
  );
}

/**
 * Set up express requirements
 */
const app = express();
const PORT = process.env.PORT;

//
// Registers a HTTP GET route for video streaming.
//
app.get("/video", (req, res) => {
  const videoPath = path.join("./videos", "example_vid.mp4");
  fs.stat(videoPath, (err, stats) => {
    if (err) {
      console.error("An error occurred ");
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, {
      "Content-Length": stats.size,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  });
});

//
// Starts the HTTP server.
//
app.listen(PORT, () => {
  console.log("Microservice is online");
});
