const express = require('express');
const app = express();
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
const partialResponse = require('express-partial-response');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var port = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.use(partialResponse());

app.use(cookieSession({
    name: 'section',
    keys: ['key1', 'key2'],
}));
app.use(cors());
app.use(cookieParser());
app.use('/static', express.static('assets'));

var val = ['123'];
app.get('/', function(req, res) {
    io.on('connection', function(socket) {
        socket.on('chat message', function(msg) {
            val = [...val, msg]
            console.log(val);
            req.session.msg = val;
            io.emit('chat message', req.session.msg);
        });
    });
    res.render('index', {
        title: 'Hey',
        message: 'hello there!'
    })
})

app.get('/user/:name', (req, res) => res.send(req.params.name));
app.get('/section', function(req, res, next) {
    req.session.views = (req.session.views || 0) + 1
    res.end(req.session.views + ' views')
})
app.get('/json', (req, res) => {
    res.json({
        firstName: 'Mohandas',
        lastName: 'Gandhi',
        aliases: [{
                firstName: 'Mahatma',
                lastName: 'Gandhi'
            },
            {
                firstName: 'Bapu'
            }
        ]
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});
