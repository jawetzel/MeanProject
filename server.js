var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

app.use(cors());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

console.log(process.env);

var port = process.env.PORT || 8080;

app.use(express.static('./frontEnd/build'));


var initialRouter = express.Router();
app.use('/api', initialRouter);

var Database = require('./Repo/Database');



app.listen(port, function(){
    console.log('running on port: ' + port);
});