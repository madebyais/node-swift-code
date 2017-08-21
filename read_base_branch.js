var fs = require('fs');
var data = require('./swift.json');
var finalData = [];
var tempDataObj = {};

data.forEach(function (d) {
  if (d && d.branch == '' && d.swiftCode.length <= 9 && !tempDataObj[d.swiftCode]) {
    finalData.push(d);
    tempDataObj[d.swiftCode] = d;
  }
});

fs.writeFile('swift-base-branch.json', JSON.stringify(finalData), 'utf-8', function (err, resp) {
  if (err) return console.dir(err);
  console.dir('Done.')
})