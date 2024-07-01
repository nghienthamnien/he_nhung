export type LineDataType = {
  labels: string[];
  datasets: {
    [key: string]: any;
    data: number[];
  }[];
};
