import express from "express";
import "./broker/mqtt";

import { getIPAddress } from "./broker/func";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";
const cookieParser = require("cookie-parser");
const brokerUrl = `mqtt://${getIPAddress()}`;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
console.log("Connected to MQTT broker: ", brokerUrl);

app.listen(8080);
