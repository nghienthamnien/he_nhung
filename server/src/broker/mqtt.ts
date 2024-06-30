// connectDB.ts
import net from "net";
import ws from "websocket-stream";

const port = 1883;
const wsPort = 8883;
const aedes = require("aedes")();

// Tạo server mqtt

const server = net.createServer(aedes.handle);
const httpServer = require("http").createServer();
ws.createServer({ server: httpServer }, aedes.handle);

server.listen(port, function () {
  console.log("Ades MQTT listening on port: " + port);
});

httpServer.listen(wsPort, function () {
  console.log("Aedes MQTT-WS listening on port: " + wsPort);
});
