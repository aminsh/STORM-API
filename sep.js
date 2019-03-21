var soap = require('soap');
var args = { TermID: '11558485', ResNum: 1000, Amount: 50000, RedirectUrl: 'http://localhost:3000/calback' };


var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var app = express();

app.set('views', __dirname);
app.engine('html', ejs.renderFile);

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));


app.get('/', function (req, res) {
    res.render('sep.ejs', args);
});

app.post('/calback', function (req, res) {
    var url = 'https://verify.sep.ir/Payments/ReferencePayment.asmx?WSDL';
    var result = req.body;
    soap.createClient(url, function(err, client) {
        client.verifyTransactionAsync(result.RefNum, args.TermID)
            .then(result => {
                debugger;
            })
    });
});



app.listen(3000);


/*
soap.createClient(url, function(err, client) {
    client.RequestToken(args, function(err, result) {
        console.log(result);
    });
});*/
