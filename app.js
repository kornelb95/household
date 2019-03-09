const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const app = express();
const graphQLSchema = require("./graphql/schema");
const graphQLResolvers = require("./graphql/resolvers");
const isAuth = require("./middlewares/isAuth");
mongoose.set("useFindAndModify", false);
app.use(bodyParser.json());
app.use(cors());
app.use(isAuth);
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
  })
);
const PORT = 8000;
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-fdmud.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });
