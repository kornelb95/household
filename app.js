const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const isAuth = require("./middlewares/isAuth");
const { ApolloServer, makeExecutableSchema } = require("apollo-server-express");
const http = require("http");

mongoose.set("useFindAndModify", false);
app.use(bodyParser.json());
app.use(cors());
const PORT = 8000;
app.use(isAuth);
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({
  schema
});
server.applyMiddleware({ app, path: "/graphql" });
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer);
let rooms = {};
io.on("connection", socket => {
  let socketFamily;
  socket.on("JOIN_TO_ROOM", (user, familyID) => {
    if (rooms[familyID] && rooms[familyID].length >= 2) {
      return false;
    }
    socketFamily = familyID;
    socket.join(familyID, () => {
      if (rooms.hasOwnProperty(familyID)) {
        rooms[familyID].push({
          user,
          socketID: socket.id,
          points: 0
        });
      } else {
        rooms[familyID] = [];
        rooms[familyID].push({
          user,
          socketID: socket.id,
          points: 0
        });
      }
      io.to(familyID).emit("ROOMS_UPDATE", rooms[familyID]);
    });
  });
  socket.on("disconnect", () => {
    const myRoom = rooms[socketFamily];
    if (myRoom !== undefined) {
      rooms[socketFamily] = myRoom.filter(user => user.socketID !== socket.id);
    }

    io.to(socketFamily).emit("ROOMS_UPDATE", rooms[socketFamily]);
  });
  socket.on("START_GAME", (me, opponent) => {
    io.to(opponent.socketID).emit("GAME_STARTED", me);
  });
  choices = [];
  socket.on("CHOICE", (choice, user) => {
    const found = choices.find(el => el.user.socketID === socket.id);
    if (found === undefined) {
      choices.push({
        user,
        choice
      });
    }

    if (choices.length === 2) {
      switch (choices[0]["choice"]) {
        case "rock":
          switch (choices[1]["choice"]) {
            case "rock":
              io.emit("remis");
              break;

            case "paper":
              choices[1].user.points++;
              io.emit("resolved", choices[1].user, choices[0].user);
              break;

            case "scissors":
              choices[0].user.points++;
              io.emit("resolved", choices[0].user, choices[1].user);
              break;

            default:
              break;
          }
          break;

        case "paper":
          switch (choices[1]["choice"]) {
            case "rock":
              choices[0].user.points++;
              io.emit("resolved", choices[0].user, choices[1].user);
              break;

            case "paper":
              io.emit("remis");
              break;

            case "scissors":
              choices[1].user.points++;
              io.emit("resolved", choices[1].user, choices[0].user);
              break;

            default:
              break;
          }
          break;

        case "scissors":
          switch (choices[1]["choice"]) {
            case "rock":
              choices[1].user.points++;
              io.emit("resolved", choices[1].user, choices[0].user);
              break;

            case "paper":
              choices[0].user.points++;
              io.emit("resolved", choices[0].user, choices[1].user);
              break;

            case "scissors":
              io.emit("remis");
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
      choices = [];
    }
  });
});

server.installSubscriptionHandlers(httpServer);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-fdmud.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server started on ${PORT}${server.graphqlPath}`);
      console.log(
        `Subscriptions ready at ws://localhost:${PORT}${
          server.subscriptionsPath
        }`
      );
    });
  })
  .catch(err => {
    console.log(err);
  });
