var mysql = require('mysql');
var async = require('async');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'pooja_database'
});

var getArticles = function() {
	var sql = "SELECT * FROM links LIMIT 5";
	connection.query(sql, function(error, results, fields) {
		if (error) {
			console.log(error);
			return;
		}

		// console.log(results);

		async.eachSeries(results, function(result, callback) {
			console.log("\n\n", result);
			scrapeData(result, callback);
		}, function(){
			console.log("All urls processed");
		});
	});
};

var scrapeData = function(row, callback) {
	var data = {
		title: '',
		body: '',
		created_at: '',
		author: ''
	};

	console.log(data);

	callback();
};



getArticles();