var express = require('express');
var app = express();
var fs = require("fs");
var dayjs = require("dayjs");
dayjs.locale('ja');
const config = require('config');

var mkdirp = require("mkdirp")
var getDirName = require("path").dirname

const PORT = config.get('server.port');
const TIFF_URL = config.get('server.tiffUrl');
const CSV_URL = config.get('server.csvUrl');
const FILE_OUTPUT_PATH = config.get('server.fileOutputPath');

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

/*
  tiff upload server
*/
app.post(TIFF_URL, function(req, res) {
  console.log(req.body);

  const extention = 'tiff';
  const folderName = `${FILE_OUTPUT_PATH}/${extention}/${dayjs().format('YYYYMMDDHHmmss')}/`;
  const fileName = req.body.file_id;
  const data = req.body.data;

  if(!fileName || !data){
      return res.status(400).json({
        error: "Bad Request"
      });
  }

  //TODO if need replace bad prefix
  var base64Data = data.replace(/^data:image\/png;base64,/, "");
  writeFile(`${folderName}/${fileName}.${extention}`, base64Data, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Internal server error"
      });
    } else {
      return res.status(200).json({
        status: "ok"
      });
    }
  });
});

/*
  csv upload server
*/
app.post(CSV_URL, function(req, res) {
  console.log(req.body);

  const extention = 'csv';
  const folderName = `${FILE_OUTPUT_PATH}/${extention}/${dayjs().format('YYYYMMDDHHmmss')}/`;
  const fileName = req.body.file_id;
  const data = req.body.data;

  if(!fileName || !data){
      return res.status(400).json({
        error: "Bad Request"
      });
  }

  //TODO if need replace bad prefix
  var base64Data = data.replace(/^data:image\/png;base64,/, "");
  writeFile(`${folderName}/${fileName}.${extention}`, base64Data, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Internal server error"
      });
    } else {
      return res.status(200).json({
        status: "ok"
      });
    }
  });
});

/*
  write file & if need make folder
*/
function writeFile(path, contents, cb) {
  console.log(getDirName(path));
  var ret = mkdirp.sync(getDirName(path));
  fs.writeFile(path, contents, 'base64', cb)
}

// server start
var server = app.listen(PORT, function() {
  console.log("listening at port %s", server.address().port);
});
