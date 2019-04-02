import React, { Component } from "react";
import { View, Text, Button, StyleSheet, ImageBackground } from "react-native";
class MainScreen extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <ImageBackground
        source={{
          uri:
            "https://cdn.pixabay.com/photo/2017/03/21/02/00/list-2160914_960_720.png"
        }}
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Family Connector</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.button}>
              <Button
                title="Załóż konto"
                onPress={() => this.props.navigation.navigate("SignupScreen")}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Zaloguj się"
                onPress={() => this.props.navigation.navigate("LoginScreen")}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  header: {
    alignItems: "center",
    marginTop: "20%"
  },
  headerText: {
    fontSize: 30,
    color: "#fff"
  },
  background: {
    width: "100%",
    height: "100%"
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: "10%"
  },
  button: {
    marginHorizontal: 20
  }
});

export default MainScreen;
