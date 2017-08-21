var async = require('async');
var req = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var startPage = 1;
var endPage = 10;

var baseUrl = 'https://www.theswiftcodes.com/indonesia/page/';
var urls = [];

for (var i = startPage; startPage <= endPage; startPage++) {
  urls.push(baseUrl + startPage + '/');
}

var worker = [];

urls.forEach(function (url) {
  worker.push(function (cb) {
    console.log('Accessing ... ' + url);
    req(url, function (err, resp, body) {
      if (err) return cb(err);
      compile(body, cb)
    });
  });
});

async.series(worker, function (err, data) {
  if (err) return console.dir(err);
  
  var finalData = [].concat.apply([], data);
  
  fs.writeFile('swift.json', JSON.stringify(finalData), 'utf-8', function (err, data) {
    if (err) return console.dir(data);
    console.log('Done.')
  });
})

function compile(html, cb) {
  var $ = cheerio.load(html);
  var obj = [];
  
  $('table.swift > tbody > tr').each(function (i, elem) {
    var tempObj = {
      bankName: $(elem).find('td:nth-child(2)').text(),
      city: $(elem).find('td:nth-child(3)').text(),
      branch: $(elem).find('td:nth-child(4)').text(),
      swiftCode: $(elem).find('td:nth-child(5)').text()
    };
    
    if ($(elem).find('td:nth-child(2)').text() != '')
      obj.push(tempObj);
  });
  
  cb(null, obj);
}