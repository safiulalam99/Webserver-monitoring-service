/*
Safiul Alam
alamsafiul99@gmail.com
*/
const express = require("express");
const fs = require("fs");
const request = require("request");
const app = express();
let logContent = {}, dataToLog = []; 
const port = 3001;

// reads the URL and content of the URL to compare if they exist within the body
// of the requested page
const readFromFile = async () => {
  fs.readFile("./sites.json", "utf-8", async (err, jsonData) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonData);
      try {
        await data.map((websiteURLs) => UrlChecker(websiteURLs));
      } catch (err) {
        console.log(err);
      }
    }
  });
};

const UrlChecker = async (URL) => {
  try {
    await request(
      { url: URL.url, time: true },
      function (error, response, body) {
        logContent = {
          URL: URL.url,
          last_checked: new Date(),
          responseTime: !response ? "No response" : response.elapsedTime,
          statusCode: !response ? "failed" : response.statusCode,
          content_match: response ? body.includes(URL.content) ? true: false
          : "No content found",
          status: response
            ? response.statusCode == undefined
              ? "down"
              : "up"
            : "down",
        };
        dataToLog.push(logContent);
        writingToFile(dataToLog);
      }
    );
  } catch (err) {
    console.log(err);
  }
};
//function to write the json object to the requestList.json file
const writingToFile = (logFile) => {
  fs.writeFile(
    "./requestList.json",
    JSON.stringify(logFile, null, 2),
    (err) => {
      !err ? console.log(`Success`) : console.log(err);
    }
  );
};
readFromFile(); // call to read, write and check site status. 

// Hosting HTML page on server
app.set("page", "./page");
app.set("view engine", "ejs");
app.get("", (req, res) => {
  res.render("index", { response: dataToLog });
});
app.listen(port, () =>
  console.log(`HTML page running on http://localhost:${port}/`)
);
