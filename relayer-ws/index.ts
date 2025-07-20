import { WebSocketServer, WebSocket as WebSocketWsType } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

const servers: WebSocketWsType[] = [];
const subscribedRoom = new Map<WebSocketWsType,Set<string>>();
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  servers.push(ws);

  ws.on('message', function message(data: string) {
    const parsedData = JSON.parse(data.toString());
    const room = parsedData.room;
    
    if (parsedData.type == "SUBSCRIBE") {
      if (!subscribedRoom.has(ws)) {
        
        subscribedRoom.set(ws,new Set())
      }
      subscribedRoom.get(ws)!.add(room)
    }
    if (parsedData.type == "chat") {
      servers.map(socket => {
        if (subscribedRoom.get(socket)?.has(room)) {      
          socket.send(data.toString());
        }
      })
    }
    if (parsedData.type == "UNSUBSCRIBE") {
      subscribedRoom.get(ws)?.delete(room);
      if (subscribedRoom.get(ws)?.size==0) {
        subscribedRoom.delete(ws);
      }
    }

  });
});