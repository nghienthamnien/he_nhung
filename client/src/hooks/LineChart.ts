import { useState } from "react";

export const useLineData = (
  xLabelNumber: number,
  initialData: number,
  datasetOptions = {}
): [
  {
    labels: string[];
    datasets: {
      data: number[];
      [key: string]: any;
    }[];
  },
  ({ createdAt, data }: { createdAt: number; data: number }) => void
] => {
  const [lineData, setLineData] = useState({
    labels: Array.from({ length: xLabelNumber }, () => ""),
    datasets: [
      {
        data: Array.from({ length: xLabelNumber }, () => initialData),
        ...datasetOptions,
      },
    ],
  });

  const pushData = (newData: number) => {
    setLineData((prev: any) => {
      const yDataArr = [...prev.datasets[0].data];
      if (yDataArr.length >= xLabelNumber) {
        yDataArr.shift();
      }
      yDataArr.push(newData);
      return {
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: yDataArr,
          },
        ],
      };
    });
  };

  const generateTimeLabels = (createdAt: number) => {
    setLineData((prev: any) => {
      const xLabels = [...prev.labels];
      if (xLabels.length >= xLabelNumber) {
        xLabels.shift();
      }
      xLabels.push(
        new Date(createdAt).toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
      return {
        ...prev,
        labels: xLabels,
      };
    });
  };

  const setData = ({
    createdAt,
    data,
  }: {
    createdAt: number;
    data: number;
  }) => {
    generateTimeLabels(createdAt);
    pushData(data);
  };

  return [lineData, setData];
};
