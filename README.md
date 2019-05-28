# Task Management Mobile App

Mobile app for managing house chores with gamification elements

### Installation

Server:
```
npm install
npm start
```

Mobile app
```
cd mobile
npm install
npm run android / npm run ios
```

### Built With

Server:
* [Express](https://expressjs.com/) - Node.js Framework
* [Mongoose](https://mongoosejs.com/) - Library for MongoDB management
* [Graphql](https://graphql.org/) - Query Language for API
* [Apollo-server-express](https://www.apollographql.com/) - Library for Graphql
* [Jsonwebtoken](https://jwt.io/) - API security
* [Socket.io](https://socket.io/) - Realtime Data Engine

Mobile App:
* [React-Native](https://facebook.github.io/react-native/) - Library for build native mobile apps using JavaScript and React
* [Expo](https://expo.io/) - Tools, environment and CLI for buil React Native apps faster using only Javascript
* [Redux](https://redux.js.org/) - App state management
* [React-navigation](https://reactnavigation.org/) - Routing and navigation for your React Native apps
* [Apollo-client](https://www.apollographql.com/) - Client library for Graphql
* [React-native-paper](https://reactnativepaper.com/) - Material Design library for React Native
* [Socket.io](https://socket.io/) - Realtime Data Engine

### Features
* Creating accounts and groups
* Joining to group
* Creating tasks with deadline and points
* Types of tasks: free, my, to accept by other members of group, to accept by me for other members, ended
* Realtime Data: I will make changes, you will see it immediately
* Two roles: Creator and member
* Sum up of ended tasks and points
* Rock, paper, scissors mini-game in order to select a person for the some task
* Sending jwt to API and secure some graphQL resolvers
* Ranking


