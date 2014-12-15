//require necessary modules
var http = require('http')
  , express = require('express')
  , socketIO = require("socket.io")
  , path = require('path')
  //, Models = require('./models')
  //, PushMessage  =  Models.PushMessage

//initialize our application
var app = express();
// app.configure(function(){
// });
var server = http.createServer(app).listen(3001);
var io = socketIO.listen(server);

//settings
// var settings = {
//   'view_directory': '/views'
// }
app.use(express.static(__dirname+'/images'));

app.get('/', function(request, res){
  res.sendFile(__dirname  + '/five.html')
});
function roomCount(room){
  localCount = 0;
  if (room) {
    for (var id in room) {
      localCount ++;
    }
  }
  return localCount;
}
var rooms={};
io.sockets.on('connection', function(client){
  // console.log('a user connected');
  //when client sends a join event
  client.on('join', function(data,fn){
    // var clients = io.sockets;
      if(data.room){
        var clients = io.sockets.adapter.rooms[data.room];
        if(!clients){
          client.join(data.room);
        }else{
          if(roomCount(clients)<2){
            client.join(data.room);
            client.broadcast.to(data.room).emit('groupchat',{'user': data.userID});
          }else{
            fn({error: 1});
          }
        }
      }
  });
  client.on('chress', function(data,fn){
      // console.log("--> "+data);
      client.broadcast.to(data.room).emit('chress',data);
      if(fn){
        fn({error: 0})
      }
  });

  //when client sends a message
  client.on('message', function(data,fn){
    
    var scid=alluids[data.touid];
    if (scid){
      scid.emit('message', {message: data.message,uid: allusers[client.id],username: data.username});
    }else{
      //fn({success:false,msg:data});
    }
    if(fn){
      fn({success: true,msg: data});
    }
  });

  // client.on('joinroom',function(data,fn){
 
  // });

  // client.on('leaveroom',function(data,fn){


  // });
  client.on('groupchat',function(data,fn){


  });

  client.on('myid', function(msg,fn){
    console.log(msg);
    if(fn){
      fn({id: client.id})
    }
  });
  client.on('disconnect', function(){
  });


})