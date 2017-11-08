/**
 * Created by fan on 2017/11/8.
 */
var fs = require('fs')
	, file = "src/JSON/1.json"
	, dd = JSON.parse(fs.readFileSync( file));

var a = {
	dayTime: function (a, callback) {
		var b = a+ 1;
		callback(b);
	}
};

module.exports = dd ;