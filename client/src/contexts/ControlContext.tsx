import { blue, yellow } from "@mui/material/colors";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { MqttContext } from "./MqttContext";
import mqtt from "mqtt";

export const ControlContext = React.createContext({} as any);
export const controlData = [
  { title: "Light", unit: "°C", color: yellow[400], icon: <WbSunnyIcon /> },
  { title: "Pump", unit: "%", color: blue[400], icon: <WaterDropIcon /> },
];
const convertTo01 = (value: boolean) => (value === true ? 1 : 0);
export const ControlContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mqttPublish } = useContext(MqttContext);

  const [allSwitchesState, setAllSwitchesState] = useState<
    Record<number, boolean>
  >(controlData.reduce((acc, _, index) => ({ ...acc, [index]: false }), {}));
  console.log("allSwitchesState", allSwitchesState);
  const [autoSwitchesState, setAutoSwitchesState] = useState<
    Record<number, boolean>
  >(controlData.reduce((acc, _, index) => ({ ...acc, [index]: false }), {}));
  console.log("autoSwitchesState", autoSwitchesState);
  const handleSwitchChange = (
    index: number,
    setState: Dispatch<SetStateAction<Record<number, boolean>>>
  ) => {
    setState((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));

    const data = {
      topic: "control",
      payload: {
        ledMode: convertTo01(
          index === 0 && setState === setAllSwitchesState
            ? !allSwitchesState[index]
            : allSwitchesState[0]
        ),
        pumpMode: convertTo01(
          index === 1 && setState === setAllSwitchesState
            ? !allSwitchesState[index]
            : allSwitchesState[1]
        ),
        ledAutoMode: convertTo01(
          index === 0 && setState === setAutoSwitchesState
            ? !autoSwitchesState[index]
            : autoSwitchesState[0]
        ),
        pumpAutoMode: convertTo01(
          index === 1 && setState === setAutoSwitchesState
            ? !autoSwitchesState[index]
            : autoSwitchesState[1]
        ),
      },
      qos: 0,
    };
    mqttPublish(data);
  };

  const handleTurnAllOn = () => {
    setAllSwitchesState((prevState) =>
      Object.fromEntries(Object.keys(prevState).map((key) => [key, true]))
    );
  };

  const handleTurnAllOff = () => {
    setAllSwitchesState((prevState) =>
      Object.fromEntries(Object.keys(prevState).map((key) => [key, false]))
    );
  };

  return (
    <ControlContext.Provider
      value={{
        allSwitchesState,
        setAllSwitchesState,
        autoSwitchesState,
        setAutoSwitchesState,
        handleSwitchChange,
        handleTurnAllOn,
        handleTurnAllOff,
      }}
    >
      {children}
    </ControlContext.Provider>
  );
};
