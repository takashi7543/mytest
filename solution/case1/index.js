const express = require('express');
const app = express();
const fs = require('fs');
const dayjs = require('dayjs');
dayjs.locale('ja');
const config = require('config');

const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;

const PORT = config.get('server.port');
const TIFF_URL = config.get('server.tiffUrl');
const CSV_URL = config.get('server.csvUrl');
const FILE_OUTPUT_PATH = config.get('server.fileOutputPath');

app.use(express.json({
  extended: true,
  limit: '10mb',
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
}));

/*
  tiff upload server
*/
app.post(TIFF_URL, function(req, res) {
  console.log(req.body);

  const extention = 'tiff';
  const folderName =
    `${FILE_OUTPUT_PATH}/${extention}/${dayjs().format('YYYYMMDDHHmmss')}/`;
  const fileName = req.body.file_id;
  const data = req.body.data;

  if (!fileName || !data) {
    return res.status(400).json({
      error: 'Bad Request',
    });
  }

  // TODO if need replace bad prefix
  const base64Data = data.replace(/^data:image\/png;base64,/, '');
  writeFile(`${folderName}/${fileName}.${extention}`, base64Data, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Internal server error',
      });
    } else {
      return res.status(200).json({
        status: 'ok',
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
  const folderName =
    `${FILE_OUTPUT_PATH}/${extention}/${dayjs().format('YYYYMMDDHHmmss')}/`;
  const fileName = req.body.file_id;
  const data = req.body.data;

  if (!fileName || !data) {
    return res.status(400).json({
      error: 'Bad Request',
    });
  }

  // TODO if need replace bad prefix
  const base64Data = data.replace(/^data:image\/png;base64,/, '');
  writeFile(`${folderName}/${fileName}.${extention}`, base64Data, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Internal server error',
      });
    } else {
      return res.status(200).json({
        status: 'ok',
      });
    }
  });
});

/**
 * writeFile - description
 *
 * @param  {Stirng} path     file output path
 * @param  {String} contents base64 encode file
 * @param  {function} cb   callback function
 */
function writeFile(path, contents, cb) {
  console.log(getDirName(path));
  mkdirp.sync(getDirName(path));
  fs.writeFile(path, contents, 'base64', cb);
}

const server = app.listen(PORT, function() {
  console.log('listening at port %s', server.address().port);
});
