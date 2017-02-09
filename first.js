var mysql   = require('mysql');
var request = require("request");
var cheerio = require("cheerio");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'pooja_database'
});
 
connection.connect();
query = "SELECT * FROM providers";
connection.query(query, function (error, results, fields) {
  if (error) throw error;
  
  for (i=0; i < results.length; i++) {
  	var domain = results[i];
  	 scrapeData(domain);
  }
});
 


var scrapeData = function(domain) {	
	request(domain.url, function(error, response, body)
	{
	    if (error) {
	        return console.error('upload failed:', error);
	    }

	     hrefs = getAllLinks(body);

    	 
    	 validLinks = getAllValidLinks(hrefs, domain);

    	 var callback = function() {
        	console.log("Finished All of ", domain.website_name);
   		 };
    	saveLinks(validLinks, domain, callback);
    
    });

    var getAllLinks = function(body) {
	    var $ = cheerio.load(body);
	    var hrefs = [];
	    $("a").each(function(i, link) {
	        var sop = $(this).attr('href');
	        hrefs.push(sop);
	    });
	    return hrefs;
    };
  	var getAllValidLinks = function(hrefs, domain){
  		switch(domain.id) {
  			case 8:
	    		var pattern = /\d{4,}\.cms/;
  				break;

  			case 7:
	    		var pattern = /.html/;
  				break;
  		}
	    var validLinks = [];
	    for (var i = 0; i < hrefs.length; i++) {
	      var aLink = hrefs[i];
	      if (pattern.test(aLink)) {
	        if (aLink.indexOf(domain.url) !==-1) {
	            validLinks.push(aLink);
	        }
	      }
	    }
	    return validLinks; 

	};
	
	var saveLinks = function(validLinks, domain, callback) {

	    var query = "INSERT INTO links (url,providers_id) VALUES ";
	    for (i = 0; i < validLinks.length; i++){ 
				var aLink = validLinks[i];
		        query = query + "('"+aLink+"','"+domain.id+"'),";
		}
        var n = query.lastIndexOf(",");
        var query = query.substring(0,n); 
	  	connection.query(query, function(err,result) {
	        console.log("Executed query for url", domain.website_name, "got error", err);
	        callback();
	    });
	};
}