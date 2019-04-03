import React from "react";
import { StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigator";
import NavigationService from "./navigation/NavigationService";
import { Provider } from "react-redux";
import createStore from "./store/createStore";
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
export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

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
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
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
