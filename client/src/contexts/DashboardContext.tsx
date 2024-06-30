import { useLineData } from "@/hooks/LineChart";
import { LineDataType, ScheduleTableFields } from "@/utils/type";
import { createContext, useContext, useEffect, useState } from "react";
import { MqttContext, dataTopic } from "./MqttContext";

export const DashboardContext = createContext<{
  cardData: ScheduleTableFields | null;
  tempLineData: LineDataType | null;
  humidLineData: LineDataType | null;
  lightLineData: LineDataType | null;
  moiLineData: LineDataType | null;
}>({
  cardData: null,
  tempLineData: null,
  humidLineData: null,
  lightLineData: null,
  moiLineData: null,
});
const datasetOptions = {
  tension: 0.2,
};
const xLabelNumber = 10;

export const DashboardContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mqttClient } = useContext(MqttContext);

  const [tempLineData, setTempLineData] = useLineData(xLabelNumber, 0, {
    ...datasetOptions,
    label: "Temperature",
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  });
  const [humidLineData, setHumidLineData] = useLineData(xLabelNumber, 0, {
    ...datasetOptions,
    label: "Humidity",
    borderColor: "rgb(54, 162, 235)",
    backgroundColor: "rgba(54, 162, 235, 0.5)",
  });
  const [lightLineData, setLightLineData] = useLineData(xLabelNumber, 0, {
    ...datasetOptions,
    label: "Light",
    borderColor: "rgb(255, 205, 86)",
    backgroundColor: "rgba(255, 205, 86, 0.5)",
  });
  const [moiLineData, setMoiLineData] = useLineData(xLabelNumber, 0, {
    ...datasetOptions,
    label: "Soil Moisture",
    borderColor: "rgb(75, 192, 192)",
    backgroundColor: "rgba(75, 192, 192, 0.5)",
  });

  useEffect(() => {
    mqttClient?.on("message", (topic, payload) => {
      if (topic === dataTopic) {
        const newData = JSON.parse(payload.toString());
        newData.createdAt = new Date().getTime();
        console.log(newData);
        setTempLineData({
          createdAt: newData.createdAt,
          data: newData.temperature,
        });
        setHumidLineData({
          createdAt: newData.createdAt,
          data: newData.humidity,
        });
        setLightLineData({
          createdAt: newData.createdAt,
          data: newData.lightValue,
        });
        setMoiLineData({
          createdAt: newData.createdAt,
          data: newData.earthMoisture,
        });
      }
    });
  }, []);

  const [cardData, setData] = useState<ScheduleTableFields | null>(null);

  return (
    <DashboardContext.Provider
      value={{
        cardData,
        tempLineData,
        humidLineData,
        lightLineData,
        moiLineData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
