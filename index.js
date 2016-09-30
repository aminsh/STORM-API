var express = require('express');

var app = express();

app.get('/', function(req,res){
    res.send('Hello accounting');
});

app.listen(process.env.PORT || 1001, function () {
    console.log('port is listening');
});
