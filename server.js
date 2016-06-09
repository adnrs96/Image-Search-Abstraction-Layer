var express = require('express');
var app = express();
var Search = require('bing.search');
var search = new Search('UPQQGrnCOJZiGxfJ1whHXFB8CNTS1IgS0QIYbnd1Bfk');
app.set('port',process.env.port || 5000);
app.get('/api/imagesearch/:data',function(req,res){
  var query_string = req.params.data;
  var offset = req.query.offset || 10;
  search.images(query_string,
  {top: offset},
  function(err, results) {
    console.log(results);
    var res_arr = [];
    var res_obj = {};
    for(var i in results)
    {
      res_obj.url=results[i].url;
      res_obj.snippet=results[i].title;
      res_obj.thumbnail=results[i].thumbnail.url;
      res_obj.context=results[i].sourceUrl;
      res_arr.push(res_obj);
      
      res.obj = {};
    }
    console.log(res_arr);
    res.json(res_arr);
  }
);
  console.log(req.params.data);
  console.log(req.query.offset);
});
app.use('/',function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.listen(app.get('port'),function(){
  console.log("Node running on port "+app.get('port'));
});