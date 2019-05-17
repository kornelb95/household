import io from "socket.io-client";
import NavigationService from "./navigation/NavigationService";
const socket = io("http://192.168.1.12:8000");

const configureSocket = dispatch => {
  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("ROOMS_UPDATE", room => {
    dispatch({ type: "UPDATE_ROOM", room });
  });
  socket.on("GAME_STARTED", myOpponent => {
    console.log(`game started`);
    dispatch({ type: "START_GAME" });
    NavigationService.navigate("GameScreen");
  });
  return socket;
};

export const joinToRoom = (user, familyID) =>
  socket.emit("JOIN_TO_ROOM", user, familyID);
export const disconnect = () => {
  socket.removeAllListeners();
  socket.disconnect();
};
export const startGameEmit = (me, opponent) => {
  socket.emit("START_GAME", me, opponent);
};
export default configureSocket;
