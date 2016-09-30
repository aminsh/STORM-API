var express = require('express');

var app = express();

app.get('/', function(req,res){
    res.send('<h1>Hello for second commint</h1>');
});

app.get('/contact', function(req,res){
    res.send('<h1>Contact</h1>');
});


app.listen(process.env.PORT || 1001, function () {
    console.log('port is listening');
});
