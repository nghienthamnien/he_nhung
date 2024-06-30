export type ScheduleTableFields = {
  avgEarthMoisture: number;
  avgHumidity: number;
  avgLightValue: number;
  avgTemperature: number;
  createdAt: number;
  [key: string]: number;
};

export type LineDataType = {
  labels: string[];
  datasets: {
    [key: string]: any;
    data: number[];
  }[];
};
