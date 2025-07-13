import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

const servers: WebSocket[] = [];

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  servers.push(ws);

  ws.on('message', function message(data: string) {
    servers.map(socket => {
        socket.send(data);
    })
  });

});