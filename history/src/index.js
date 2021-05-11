const express = require("express");

function setupHandlers(app) {
    // Sub for microservice hello
}

function startHttpServer() {
    return new Promise(resolve => {
        const app = express();
        setupHandlers(app);
        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        app.listen(port, () => {
            resolve();
        })
    })
}

function main() {
    console.log("Hello History");

    return startHttpServer();
}

main()
    .then(() => console.log("Microservice online - History"))
    .catch(err => {
        console.error("Microservice History Failed");
        console.error(err && err.stack || err);
    })