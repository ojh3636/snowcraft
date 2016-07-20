
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var UserObject = require("./Objects/UserObject.js");
var port = process.env.PORT || 3000;

var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, W = 87, A = 65, S = 83, D = 68;

var GAME_SETTINGS = {
  WIDTH : 600, HEIGH : 600, BACKGROUND_COLOR : "#FFFFFF"
};


http.listen(port, function() {
  console.log("server on!");
});
// open http listner

app.use(express.static(path.join(__dirname + '/public')));

// setting static file to send to client web browser

var users = {};
// the user array (who still connected)

io.on('connection', function(socket) {
  console.log('user connected: ', socket.id);
  users[socket.id] = new UserObject(socket.id); //make userobject who newly connect

  io.to(socket.id).emit('get_initial_game_settings', GAME_SETTINGS); // give client to initial game settings for canvas drawing

  socket.on('disconnect', function() {
    delete users[socket.id];
    console.log('user disconnect', socket.id);
  });
  socket.on('keydown', function(keyCode){
    users[socket.id].key[keyCode]=true;
  });
  socket.on('keyup', function(keyCode){
    users[socket.id].key[keyCode]=false;
  });
});

var update = setInterval(function () {
  
  
  for(var id in io.sockets.clients().connected) {
    var idArray = [];
    var statusArray = {};
     
    if(users[id].key && users[id].key[LEFT]) {
      users[id].status.x -= 2;
    }
    else if(users[id].key && users[id].key[A]) {
      users[id].status.x -= 2;
    }
    if(users[id].key && users[id].key[UP]) {
      users[id].status.y -= 2;
    }
    else if(users[id].key && users[id].key[W]) {
      users[id].status.y -= 2;
    }
    if(users[id].key && users[id].key[RIGHT]) {
      users[id].status.x += 2;
    }
    else if(users[id].key && users[id].key[D]) {
      users[id].status.x += 2;
    }
    if(users[id].key && users[id].key[DOWN]) {
      users[id].status.y += 2;
    }
    else if(users[id].key && users[id].key[S]) {
      users[id].status.y += 2;
    }
    idArray.push(id);
    statusArray[id] = users[id].status;
  }

  io.emit('update',idArray, statusArray);

},10);
