import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

app.get("/video", (req, res) => {

    const videoPath = path.join("./video", "example_vid.mp4");
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

app.listen(port, () => {
    console.log(`Listening on port ${port}, go to localhost:${port}`)
})