/**
 * Import npm packages
 */
const express = require("express");
const fs = require("fs");
const path = require("path");

/**
 * Set up express requirements
 */
const app = express();
const port = 3000;

/**
 * Get and stream a single video 
 */
app.get("/video", (req, res) => {

    const videoPath = path.join("./content", "example_vid.mp4");
    fs.stat(videoPath, (err, stats) => {
        if (err) {
            console.error("Oh no! There was an error")
            res.sendStatus(500);
            return;
        }

        res.writeHead(200, {
            "Content-Length": stats.size,
            "Content-Type": "video/mp4"
        });
        fs.createReadStream(videoPath).pipe(res)
    })
})

/**
 * Run the app and listen on the port
 */
app.listen(port, () => {
    console.log(`Listening on port ${port}, go to localhost:${port}`)
})