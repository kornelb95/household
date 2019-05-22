import io from "socket.io-client";
import NavigationService from "./navigation/NavigationService";
const socket = io("https://servertaskapp.herokuapp.com");

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
  socket.on("remis", (choice1, choice2) => {
    dispatch({
      type: "REMIS",
      payload: { user1: choice1.user, user2: choice2.user }
    });
  });
  socket.on("resolved", (winner, looser) => {
    dispatch({
      type: "RESOLVED",
      payload: { winner: winner.user, looser: looser.user }
    });
  });
  socket.on("gameover", winner => {
    console.log("gameover");

    dispatch({ type: "GAME_OVER", payload: winner });
    setTimeout(() => {
      NavigationService.pop();
      dispatch({ type: "CLEAR_GAMEROOM" });
    }, 3000);
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
export const makeChoice = (choice, me) => {
  socket.emit("CHOICE", choice, me);
};
export default configureSocket;
