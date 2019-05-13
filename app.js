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
