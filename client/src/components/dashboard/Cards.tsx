import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Grid,
  Skeleton,
} from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import GrassIcon from "@mui/icons-material/Grass";
import { blue, cyan, red, yellow } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { DashboardContext } from "@/contexts/DashboardContext";
const sxIconOptions = {
  fontSize: "3rem",
  position: "absolute",
  right: "0",
  top: "1rem",
  color: "white",
};
const cardDetails = [
  {
    title: "Temperature",
    unit: "°C",
    value: 20,
    icon: <DeviceThermostatIcon sx={sxIconOptions} />,
    backgroundColor: red[400],
    field: "avgTemperature",
  },
  {
    title: "Humidity",
    unit: "%",
    value: 30,
    icon: <OpacityIcon sx={sxIconOptions} />,
    backgroundColor: blue[400],
    field: "avgHumidity",
  },
  {
    title: "Light Intensity",
    unit: "Lux",
    value: 1000,
    icon: <Brightness7Icon sx={sxIconOptions} />,
    backgroundColor: yellow[400],
    field: "avgLightValue",
  },
  {
    title: "Soil Moisture",
    unit: "%",
    value: 50,
    icon: <GrassIcon sx={sxIconOptions} />,
    backgroundColor: cyan[400],
    field: "avgEarthMoisture",
  },
];
export const DbCards = () => {
  const { cardData } = useContext(DashboardContext);
  const [fromTime, setFromTime] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (cardData) {
      setFromTime(moment(cardData.createdAt).startOf("minute").fromNow());
      interval = setInterval(() => {
        setFromTime(moment(cardData.createdAt).startOf("minute").fromNow());
      }, 1000 * 60);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [cardData]);
  return (
    <Grid container spacing={2}>
      {cardData
        ? cardDetails.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={`db_card_${index}`}>
              <BasicCard
                title={card.title}
                unit={card.unit}
                value={cardData[card.field].toFixed(2)}
                icon={card.icon}
                backgroundColor={card.backgroundColor}
                fromTime={fromTime}
              />
            </Grid>
          ))
        : cardDetails.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={`db_card_${index}`}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                animation="wave"
              />
            </Grid>
          ))}
    </Grid>
  );
};

const BasicCard = ({
  title,
  value,
  unit,
  icon,
  backgroundColor,
  fromTime,
}: {
  title: string;
  value: string;
  unit: string;
  icon: any;
  backgroundColor: string;
  fromTime: string;
}) => {
  return (
    <Card
      sx={{
        maxWidth: 360,
      }}
      className="relative"
    >
      <CardContent
        sx={{
          backgroundColor: backgroundColor,
        }}
      >
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {title}
        </Typography>
        {icon}
        <Typography variant="body2">
          <span className="text-3xl mr-1">{value}</span>
          <span className="text-xl">{unit}</span>
        </Typography>
      </CardContent>
      <CardActions className="flex flex-row justify-between">
        <div className="text-xs select-none opacity-75">{fromTime}</div>
      </CardActions>
    </Card>
  );
};
