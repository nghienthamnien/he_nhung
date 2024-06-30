import mqtt from "mqtt";
import { getIPAddress } from "./func";

const brokerUrl = `mqtt://${getIPAddress()}`;
const topicDataEsp32 = "esp32/data";

// Kết nối đến broker
export const clientDataEsp32 = mqtt.connect(brokerUrl);
export const clientFromEsp32 = mqtt.connect(brokerUrl);

// Khi kết nối thành công
export const clineData = () => {
  clientDataEsp32.on("connect", () => {
    console.log("Connected to MQTT broker at " + brokerUrl);
    // Đăng ký để nhận tin nhắn từ chủ đề đã chọn
    clientDataEsp32.subscribe(topicDataEsp32);
  });
  clientDataEsp32.on("message", async (topic, message) => {
    console.log(`Received message from ${topic}: ${message.toString()}`);

    // await createData(message);
  });
  // Xử lý lỗi nếu có
  clientDataEsp32.on("error", (err) => {
    console.error(`Error: ${err}`);
  });
};
