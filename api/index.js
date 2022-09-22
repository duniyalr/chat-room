const express = require('express');
const morgan = require('morgan');
const http = require('http');
const debug = require('debug')("app:debug");
const errorHandler = require('.././middlewares/errHandler');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.sendFile('client/index.html', { root: '../' });
});

io.on('connection', (socket) => {
  debug('A new user connected');
  socket.on('chat-message', (message) => {
    console.log(message);
    io.emit('broadcast-message', message);
  });
  socket.on('disconnect', () => {
    socket.disconnect();
  });
});

app.use(errorHandler);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  debug('Listening on port ' + PORT + '...');
});
