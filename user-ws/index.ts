import { WebSocketServer, WebSocket as WebSocketWsType } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

interface Room {
    sockets: WebSocketWsType[]
} 

const rooms: Record<string, Room> = {

}

const RELAYER_URL = "ws://localhost:3001";
const relayerSocket = new WebSocket(RELAYER_URL);

relayerSocket.onmessage = ({data}) => {
    const parsedData = JSON.parse(data.toString());
   
    if (parsedData.type == "chat") {
        const room = parsedData.room;
        rooms[room].sockets.map(socket => socket.send(data))
    }
}


wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    
    const parsedData = JSON.parse(data.toString());
    const room = parsedData.room;
    if (parsedData.type == "join-room") {
        if (!rooms[room]) {
            rooms[room] = {
                sockets: []
            }
        }
        rooms[room].sockets.push(ws);
        
        
        relayerSocket.send(JSON.stringify({
            "type": "SUBSCRIBE",
            "room": room
        }))
    }
    if (parsedData.type == "chat") {
        relayerSocket.send(data.toString());
    }
    if(parsedData.type == "leave-room") {
        relayerSocket.send(JSON.stringify({
            "type": "UNSUBSCRIBE",
            "room": room
        }))
        rooms[room].sockets= rooms[room].sockets.filter(socket=> socket!=ws)
    }
  });
});