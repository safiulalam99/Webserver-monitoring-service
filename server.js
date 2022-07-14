const sites = require("./sites.json");
const fs = require("fs");
const request = require("request");
const { url } = require("inspector");
let logContent = {};
let dataToLog = [];
let checkedURL;

const readFromFile = async () => {
  fs.readFile("./sites.json", "utf-8", async (err, jsonData) => {
    if (err) {
      console.log("Error in reading", err);
    } else {
      const data = JSON.parse(jsonData);
      try {
        const mappedData = await data.map(
          (m) => (checkedURL = UrlCheck(m))
        );
      } catch (err) {
        console.log(err);
      }
    }
  });
};

const UrlCheck = async (URL) => {
  const errorCode = 404;
  try {
    await request({ url: URL.url, time: true }, function (error, response, body) {
      logContent = {
        name: URL.url,
        responseTime: !response ? "No response" : response.elapsedTime,
        statusCode: !response ? errorCode : response.statusCode,
        body: [!response ? "No response" : body],
      };
      dataToLog.push(logContent);
      writingToFile(dataToLog)
      console.log(body)
    });
  } catch (err) {
    console.log("#####" + err);
  }
};
const writingToFile = (logFile) => {
  fs.writeFile("./finalList.json", JSON.stringify(logFile, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("SUCCESS!!");
    }
  });
};

readFromFile();
