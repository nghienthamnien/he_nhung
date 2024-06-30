import React, { createContext, useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { Button, TextField } from "@mui/material";
import Cookies from "js-cookie";

export const MqttContext = createContext<{
  mqttClient: MqttClient | null;
  mqttPublish: (context: any) => void;
  mqttSub: (subscription: any) => void;
  mqttUnSub: (subscription: any) => void;
  mqttDisconnect: () => void;
}>({
  mqttClient: null,
  mqttPublish: () => {},
  mqttSub: () => {},
  mqttUnSub: () => {},
  mqttDisconnect: () => {},
});

export const dataTopic = "esp32/data";
export const controlTopic = "control";
export const MqttContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [brokerUrl, setBrokerUrl] = useState<string>(
    `${Cookies.get("brokerUrl") || "ws://"}`
  );
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(
    mqtt.connect(brokerUrl)
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (mqttClient) {
      mqttClient.on("connect", () => {
        console.log("Connected to MQTT broker at " + brokerUrl);
        setIsSuccess(true);
        mqttSub({ topic: dataTopic, qos: 0 });
        mqttSub({ topic: controlTopic, qos: 0 });
      });
      mqttClient.on("error", (err) => {
        console.error(`Error: ${err}`);
        mqttClient.end();
      });
    }
  }, [mqttClient]);

  const mqttPublish = (context: any) => {
    if (mqttClient && mqttClient.connected) {
      // topic, QoS & payload for publishing message
      const { topic, qos, payload } = context;
      console.log("Publishing message:", context);
      console.log(topic, payload);
      mqttClient.publish(topic, JSON.stringify(payload), { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  const mqttSub = (subscription: any) => {
    if (mqttClient && mqttClient.connected) {
      // topic & QoS for MQTT subscribing
      const { topic, qos } = subscription;
      // subscribe topic
      mqttClient.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        console.log(`Subscribe to topics: ${topic}`);
      });
    }
  };

  const mqttUnSub = (subscription: any) => {
    if (mqttClient && mqttClient.connected) {
      const { topic, qos } = subscription;
      mqttClient.unsubscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
          return;
        }
        console.log(`unsubscribed topic: ${topic}`);
      });
    }
  };

  const mqttDisconnect = () => {
    if (mqttClient && mqttClient.connected) {
      try {
        mqttClient.end(false, () => {
          console.log("disconnected successfully");
        });
      } catch (error) {
        console.log("disconnect error:", error);
      }
    }
  };
  return isSuccess ? (
    <MqttContext.Provider
      value={{
        mqttClient,
        mqttPublish,
        mqttSub,
        mqttUnSub,
        mqttDisconnect,
      }}
    >
      {children}
    </MqttContext.Provider>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        gap: "10px",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Mqtt Broker Url</h1>
      <TextField
        label="Input url"
        variant="outlined"
        onChange={(event) => {
          setBrokerUrl(event.target.value);
        }}
        sx={{ width: "25ch" }}
        value={brokerUrl}
      />
      <Button
        variant="outlined"
        onClick={() => {
          try {
            console.log("connecting to broker at " + brokerUrl);
            setMqttClient(mqtt.connect(brokerUrl));
            Cookies.set("brokerUrl", brokerUrl, { expires: 1 / 24 }); // Add this line
          } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => {
              setErrorMessage("");
            }, 1000);
          }
        }}
        sx={{ width: "25ch" }}
        color="success"
      >
        Click
      </Button>

      <div
        style={{
          color: "red",
          opacity: 0.75,
          height: "1rem",
        }}
      >
        {errorMessage}
      </div>
    </div>
  );
};
