var mysql = require('mysql');
var async = require('async');
var cheerio = require('cheerio');
var request = require("request");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'pooja_database'
});

var getArticles = function() {
	var sql = "SELECT * FROM links";
	connection.query(sql, function(error, results, fields) {
		if (error) {
			console.log(error);
			return;
		}
		
			//console.log(results);

		async.eachSeries(results, function(result, callback) {
			//console.log("\n\n", result);
			scrapeData(result,callback);
		}, function(){
			console.log("All urls processed");
		});
	});
};


var scrapeData = function(row,callback) {	
	request(row.url, function(error, response, body)
	{
	    if (error) {
	        return console.error('upload failed:', error);
	    }

	     	var $ = cheerio.load(body);
			//console.log(row.url);
			switch(row.providers_id){
				case 8:
					var data = {
						title : $('h1.heading').text(),
			    		description : $('div.fsynop').text(),
			    		created : $('div.sheading').find("span").text(),
			    		author : $("span").find("a").text()
					};
				break;
				
				case 7:
					var data = {
						title : $('div.story-highlight').find("h1").text(),
			    		description : $('article.story-details').find("p").text(),
			  			created : $('span.text-dt').text(),
			    		author : $('div.para-txt').find("a").text()
			    	};
			    break;
			}
			console.log("scrapeData:",data);
    });

}									

getArticles();

