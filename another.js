var mysql = require('mysql');

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

		console.log(results);
	});
}; 

getArticles();