import React from "react";
import { StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon, Permissions } from "expo";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigator";
import NavigationService from "./navigation/NavigationService";
import { Provider } from "react-redux";
import createStore from "./store/createStore";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SubscriptionClient } from "subscriptions-transport-ws";
const wsClient = new SubscriptionClient(
  `ws://servertaskapp.herokuapp.com/graphql`,
  {
    reconnect: true
  }
);
const httpLink = new HttpLink({
  uri: "https://servertaskapp.herokuapp.com/graphql"
});
const webSocketLink = new WebSocketLink(wsClient);
const requestLink = ({ queryOrMutationLink, subscriptionLink }) =>
  ApolloLink.split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    subscriptionLink,
    queryOrMutationLink
  );
const link = ApolloLink.from([
  requestLink({
    queryOrMutationLink: httpLink,
    subscriptionLink: webSocketLink
  })
]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#D916AB",
    accent: "#f1c40f",
    text: "#fff",
    background: "#12B2AF",
    placeholder: "#fff"
  }
};
const store = createStore();
// export const socket = configureSocket(store.dispatch);
export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };
  async componentDidMount() {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <ApolloProvider client={client}>
          <View style={styles.container}>
            <Provider store={store}>
              <PaperProvider theme={theme}>
                <AppNavigator
                  ref={navigationRef => {
                    NavigationService.setTopLevelNavigator(navigationRef);
                  }}
                />
              </PaperProvider>
            </Provider>
          </View>
        </ApolloProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        "amatic-font": require("./assets/fonts/AmaticSC-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
