/*
Safiul Alam
alamsafiul99@gmail.com
*/

// const l = require('./requestList.json')
const express = require("express");
const app = express();
const http = require("http");
const fs = require("fs");
const request = require("request");
let logContent = {}; //stores individual URL tasks (status, code, response time)
let dataToLog = []; // array where all requested URL objects are stored

// reads the URL and content of the URL to compare if they exist within the body
// of the requested page
const readFromFile = async () => {
  fs.readFile("./sites.json", "utf-8", async (err, jsonData) => {
    if (err) {
      console.log("Error in reading", err);
    } else {
      const data = JSON.parse(jsonData);
      try {
        const mappedData = await data.map((websiteURL) =>
          UrlChecker(websiteURL)
        );
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
        var time = new Date();

        logContent = {
          URL: URL.url,
          last_checked: time,
          responseTime: !response ? "No response" : response.elapsedTime,
          statusCode: !response ? "failed" : response.statusCode,
          content_match: response
            ? body.includes(URL.content)
              ? true
              : false
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
    console.log("ERROR IS: " + err);
  }
};

//function to write the json object to the requestList.json file
const writingToFile = (logFile) => {
  fs.writeFile(
    "./requestList.json",
    JSON.stringify(logFile, null, 2),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Success!");
      }
    }
  );
};

readFromFile();

// Hosting server to display the 
app.set("page", "./page");
app.set("view engine", "ejs");

app.get("", (req, res) => {
  const some = JSON.stringify(dataToLog);
  res.render("index", { text: dataToLog });
});

app.listen(3000, () =>
  console.log(`Server is running on http://localhost:3000/`)
);
