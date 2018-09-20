var http = require('http');
var express = require('express');
var app = express();

var cors = require('cors');
var bodyParser = require('body-parser');



var server = http.createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 8080;
server.listen(port);

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


//Serve that front end
app.use('/', express.static('./FrontEnd/public-portal/build/'));


//get that API up
var initialRouter = express.Router();
app.use('/api', initialRouter);

var Database = require('./Repo/Database');

require('./Controller')(initialRouter, Database);

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
});

// send index for unmatched get routes for react routing
app.get('*', function(req, res, next) {
    console.log('hello moto');
    res.sendFile('./FrontEnd/public-portal/build/index.html', {root: __dirname});
});
