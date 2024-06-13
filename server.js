const https = require('https'); // 获取需要的证书，如果本地没有安装根证书会自动安装，过程中需要管理员权限
// const http = require('http'); //调试使用 获取需要的证书，如果本地没有安装根证书会自动安装，过程中需要管理员权限
const fs = require('fs');
const path = require('path')
const WebSocket = require('ws');
var keypath=path.resolve('./ws-server', 'localhost-key.pem');//我把秘钥文件放在运行命令的目录下测试
var certpath=path.resolve('./ws-server', 'localhost.pem');//console.log(keypath);
console.log(keypath,certpath )
var credentials = {
     key: fs.readFileSync(keypath),
     cert: fs.readFileSync(certpath),
};
const httpsServer = https.createServer(credentials, (req, res) => {
     res.writeHead(200); 
     res.end('Hello World!'); 
}).listen(9999)

const wss = new WebSocket.WebSocketServer({server: httpsServer});
wss.on('connection', function connection(ws) {  
     // 一、客户端建立链接
     // const clientWs = new WebSocket('ws://192.168.1.142:9001'); 调试使用
     // const clientWs = new WebSocket('ws://192.168.2.24:9001');
     const clientWs = new WebSocket('ws:localhost:9001');
     // 二、客户端建立连接
     clientWs.on('open', function open() {
          console.log('clientWs Connection open');

          // 服务器端转发消息到应用表建立连接完成
          ws.send('Welcome to the WebSocket server!');  
     })
     // 三、客户端收到消息
     clientWs.on('message', function incoming(message) {  
          // console.log('clientWs received: %s', message);  
               
          // 服务器端转发消息到应用
          if(message == '连接设备失败'){
               ws.send('no device');  
          }else{
               ws.send(`${message}`);  
          }
          
          
     });  
     // 四、客户端关闭
     clientWs.on('close', function close() {  
          console.log('clientWs Connection closed');  
     });  
     
     // 五、客户器端错误
     clientWs.on('error', function error(err) {  
          console.error('clientWs WebSocket Error: ', err);  
     });  

     // 1、服务端接收消息
     ws.on('message', function incoming(message) {  
          // console.log('received: %s', message);  
               
          // 客户端发送消息到设备服务器  
          if(clientWs.readyState === clientWs.OPEN){
               clientWs.send(`${message}`)
          }else if(clientWs.readyState === clientWs.CLOSED){
               ws.send('no device')
          }else if(clientWs.readyState === clientWs.CONNECTING){
               ws.send('no device')
          }
     });  

     // 2、服务器端关闭
     ws.on('close', function close() {  
          console.log('Connection closed');  
     });  
     
     // 3、服务器端错误
     ws.on('error', function error(err) {  
          console.error('WebSocket Error: ', err);  
     });  
});  
  
console.log('WebSocket server listening on port 9999');
