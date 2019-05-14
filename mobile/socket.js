import io from "socket.io-client";

const socket = io("http://192.168.1.12:8000");

const configureSocket = dispatch => {
  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("ROOMS_UPDATE", room => {
    console.log(room);
    dispatch({ type: "UPDATE_ROOM", room });
  });
  return socket;
};

export const joinToRoom = (user, familyID) =>
  socket.emit("JOIN_TO_ROOM", user, familyID);
export const disconnect = () => {
  socket.removeAllListeners();
  socket.disconnect();
};
export default configureSocket;
