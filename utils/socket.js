import { Platform } from "react-native";
import io from "socket.io-client";

const socket = {
  connect: () =>
    io.connect(
      Platform.OS === "web" ? "http://localhost:3000" : "http://10.0.0.28:3000"
    ),
  get: () => io(),
};
export default socket;
