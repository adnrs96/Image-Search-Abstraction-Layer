var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var ts = require('unix-timestamp');
var Search = require('bing.search');
var search = new Search(process.env.BINGSRCH_APIKEY);
var url = process.env.MONGOLAB_URI;
app.set('port',process.env.PORT || 5000);
app.get('/api/imagesearch/:data',function(req,res){
  var query_string = req.params.data;
  var offset = req.query.offset || 10;
  var query_record = {};
  query_record.term=query_string;
  query_record.when=new Date().toISOString();
  console.log(query_record.when);
  search.images(query_string,
  {top: offset},
  function(err, results) {
    //console.log(results);
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
    //console.log(res_arr);
    if(res_arr.length>0)
    {
      MongoClient.connect(url,function(err,db){
      if(err)
      console.log(err);
      else
      {
        var recent_search = db.collection('recent_search');
        recent_search.insert(query_record,function(err,data){
          if(err)
          console.log(err);
          else
          console.log(JSON.stringify(data));
          db.close();
        });
      }
    });
    }
    res.json(res_arr);
  }
);
  console.log(req.params.data);
  console.log(req.query.offset);
});
app.get('/api/latest/imagesearch/',function(req,res){
  
  MongoClient.connect(url,function(err,db){
    if(err)
    console.log(err);
    else
    {
      var recent_search = db.collection('recent_search');
      recent_search.find().sort({_id:-1}).limit(10).toArray(function(err,doc){
        if(err)
        console.log(err);
        else
        {
          console.log(doc);
          res.json(doc);
          db.close();
        }
      });
    }
  });
});
app.use('/',function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.listen(app.get('port'),function(){
  console.log("Node running on port "+app.get('port'));
});