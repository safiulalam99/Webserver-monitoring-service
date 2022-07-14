const fs = require("fs");
const request = require("request");
let logContent = {};
let dataToLog = [];
let checkedURL;

const statusCode = {
    'code':'404 Informational Request',
    'code':'2 xx Successful Request',
    'code':'3 xx Redirects',
    'code':'4 xx Client Errors',
    'code':'5 xx Server Errors',
} 
console.log(statusCode)

// reads the URL and content of the URL to compare if they exist within the body 
// of the rquest page
const readFromFile = async () => {
  fs.readFile("./sites.json", "utf-8", async (err, jsonData) => {
    if (err) {
      console.log("Error in reading", err);
    } else {
      const data = JSON.parse(jsonData);
      try {
        const mappedData = await data.map((m) => (checkedURL = UrlCheck(m)));
      } catch (err) {
        console.log(err);
      }
    }
  });
};

const UrlCheck = async (URL) => {
  const errorCode = 404;
  try {
    await request(
      { url: URL.url, time: true },
      function (error, response, body) {
        var time = new Date();
        // var initialResponseTime = 
    
        logContent = {
            URL: URL.url,
            last_checked: time,
          responseTime: !response ? "No response" : response.elapsedTime,
          statusCode: !response ? 'failed' : response.statusCode,
            // body: [!response ? "No response" : body],
            // content_match: response
            //   ? body.includes(URL.content)
            //     ? true
            //     : false
            //   : "No content found",
          status:response ? (response.statusCode==undefined ?'down':'up') : 'down',
        };
        dataToLog.push(logContent);
        writingToFile(dataToLog);
      }
    );
  } catch (err) {
    console.log("#####" + err);
  }
};

//function to write the json object to the requestList.json file
const writingToFile = (logFile) => {
  fs.writeFile("./requestList.json", JSON.stringify(logFile, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("SUCCESS!");
    }
  });
};

readFromFile();
