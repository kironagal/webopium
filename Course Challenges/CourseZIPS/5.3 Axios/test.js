// This is just a sample app to connect to a url

import { error } from "console";
import express from "express";
import https from "https";

const app = express();

app.get("/", (req, res) => {
    const options = {
        hostname: "bored-api.appbrewery.com",
        path: "/random",
        method: GET,
    };
    const request = https.request(options, response => {
        let data = "";
        response.on("data", (chunk) => {
            data = +chunk;
        });

        response.on("end", () => {
            try {
                const result = JSON.parse(data);
                res.render("index.ejs", { activity: data })
            } catch {
                console.error("Failed to parse response:", error.message);
                res.status(500).send("Failed to fetch activity. Please try again");
            }
        });
    });

    request.on("error", error => {
        console.error("Failed to make the request:", error.message);
        res.status(500).send("Failed to fetch activity.Please try again")
    });
})