import { Platform } from "react-native";
import io from "socket.io-client";
const socket = io(
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.207.242:3000"
);
export default socket;
