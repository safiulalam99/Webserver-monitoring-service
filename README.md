# Webserver-monitoring-service

A script that reads website URL's from a given JSON file and sends http requests to validate if the website is down or not.

## Features 
- [x] Maps URL in from the given JSON file and sends HTTP requests using request library.
- [x] Checks if the website body content matches the given requirements.
- [x] Logs the output (response time, status code, content_match, last checked) to a JSON file.
- [x] Simultaneously starts an Express server where it hosts a HTML interface to display the URL's status 

## Tech
- [Node.js](https://nodejs.org/en/) - evented I/O for the backend
- [Express](http://expressjs.com/) - fast node.js network app framework
- [Request](https://github.com/request/request) - Simplified HTTP client
- [EJS](https://ejs.co/) - Embedded JavaScript templating language


## How to get started

The program requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and run the `server` file.

```sh
npm i
node server.js
```



