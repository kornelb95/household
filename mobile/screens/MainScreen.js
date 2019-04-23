import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { connect } from "react-redux";
import { authAutoSignIn } from "../store/actions/user";
class MainScreen extends Component {
  static navigationOptions = {
    header: null
  };
  componentDidMount() {
    this.props.onAutoSignIn();
  }
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
                mode="contained"
                color="#D916AB"
                onPress={() => this.props.navigation.navigate("SignupScreen")}
              >
                Załóż konto
              </Button>
            </View>
            <View style={styles.button}>
              <Button
                mode="contained"
                color="#D916AB"
                onPress={() => this.props.navigation.navigate("LoginScreen")}
              >
                Zaloguj się
              </Button>
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
const mapDispatchToProps = dispatch => {
  return {
    onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};
export default connect(
  null,
  mapDispatchToProps
)(MainScreen);
