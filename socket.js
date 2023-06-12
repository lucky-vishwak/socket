const express=require('express')
const app=express()
const http=require('http')
const server=http.createServer(app)
const io=require('socket.io')(8900,{
   cors:{
      origin:"*"
   }
});
// const io=new Server(server)
// var io = require('socket.io')(8900,{
//     cors:{
//        origin:"*"
//     }
//  });
 var user=[]
 function removeuser(socketid){
    for(var i=0;i<user.length;i++){
       if(user[i].socketid==socketid){
          user.splice(i,1)
          break
       }
    }
 }
 function adduser(userid,socketid){
    obj={socketid:socketid,
          userid:userid}
    for(var i=0;i<user.length;i++){
       if(user[i].userid==userid){
          user[i]=obj;
          break;
       }
    }
    if(i==user.length)user.push(obj)
 }
 function findsid(userid){
    for(var i=0;i<user.length;i++){
       if(user[i].userid==userid){
          return user[i].socketid
       }
    }
 }
 function finduid(socketid){
    for(var i=0;i<user.length;i++){
       if(user[i].socketid==socketid){
          return user[i].userid
       }
    }
 }
 //Whenever someone connects this gets executed
 io.on('connection', function(socket){
    console.log('A user connected');
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect',async function () {
       await removeuser(socket.id)
       console.log(socket.id,'A user disconnected');
       io.emit("users",user)
    });
    socket.on("adduser",async (userid)=>{
       await adduser(userid,socket.id)
       io.emit("users",user)
    })
    socket.on("sendmessage",(user)=>{
       userid=user[0]
       console.log(userid)
       toaddr=findsid(userid)
       io.to(toaddr).emit("getmessage",[finduid(socket.id)])
    })
 });
 
//  module.exports = io;

server.listen(7700,()=>{
   console.log(`running the port for socket`)
})