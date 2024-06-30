import mqtt from "mqtt";
import { getIPAddress } from "./func";

const brokerUrl = `mqtt://${getIPAddress()}`;
const topic = "control";
const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  console.log("Connected to MQTT broker at " + brokerUrl);
  // Đăng ký để nhận tin nhắn từ chủ đề đã chọn
  client.subscribe(topic);
});
client.on("message", async (topic, message) => {
  console.log(`Received message from ${topic}: ${message.toString()}`);

  // await createData(message);
});
