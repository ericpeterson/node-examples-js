(function () {
  "use strict";

  require('./buffer-concat');

  var http = require("http"),
    fs = require("fs"),
    data = fs.readFileSync("./coolaj86-2010.jpg"),
    client,
    request;

  var crlf = "\r\n",
    // Boundary: "--" + up to 70 ASCII chars + "\r\n"
    boundary = '---------------------------10102754414578508781458777923',
    delimiter = /* crlf + -- node adds this already */ "--" + boundary,
    preamble = "", // any text we wish to have ignored
    epilogue = "", // more text to ignore
    headers = [
      'Content-Disposition: form-data; name="fileToUpload"; filename="coolaj86-2010.jpg"' + crlf,
      'Content-Type: image/jpeg' + crlf,
    ],
    //bodyPart = headers.join('') + crlf + data.toString(),
    //encapsulation = delimiter + crlf + bodyPart,
    closeDelimiter = crlf /* compensating for skipped crlf above */ + delimiter + "--",
    multipartBody; // = preamble + encapsulation + closeDelimiter + epilogue + crlf /* node doesn't add this */;

  multipartBody = Buffer.concat(
    new Buffer(preamble + delimiter + crlf + headers.join('') + crlf),
    data,
    new Buffer(closeDelimiter + epilogue + crlf)
  );
  console.log(multipartBody.length);



  client = http.createClient(80, "www.phpletter.com");
  request = client.request('POST', '/contents/ajaxfileupload/doajaxfileupload.php', {
    'Host': 'www.phpletter.com',
    'User-Agent': 'Node.JS',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-us,en;q=0.5',
    'Accept-Encoding': 'gzip,deflate',
    'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
    'Keep-Alive': 115,
    'Connection': 'keep-alive',
    'Referer': 'http://www.phpletter.com/Demo/AjaxFileUpload-Demo/',
    'Cookie': 'PHPSESSID=vrunqnvon9kv3675pq6r9ponb1; __utma=158605435.700113097.1294360062.1294360062.1294360062.1; __utmb=158605435; __utmc=158605435; __utmz=158605435.1294360062.1.1.utmccn=(organic)|utmcsr=google|utmctr=http+upload+demo|utmcmd=organic',
    'Content-Type': 'multipart/form-data; boundary=---------------------------10102754414578508781458777923',
    //'Content-Length': 258707
    'Content-Length': multipartBody.length
  });

  request.write(multipartBody);
  request.end();

  request.on('error', function (err) {
    console.log(err);
  });

  request.on('response', function (response) {
    console.log('response incoming');
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("[RESP] " + chunk.toString());
    });
    response.on('end', function () {
      console.log("done");
    });
  });
}());
