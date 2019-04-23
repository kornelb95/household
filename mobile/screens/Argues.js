import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  TouchableHighlight
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import Header from "../components/Header";
class ArguesScreen extends Component {
  state = {};
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Header />
          <View style={styles.choresArea}>
            <Text style={styles.addTaskText}>Dodaj zadanie</Text>
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate("addTaskModal")}
              style={styles.addTaskIconWrapper}
            >
              <Ionicons
                style={styles.addTaskIcon}
                name="ios-add-circle"
                color="white"
                size={32}
              />
            </TouchableHighlight>
          </View>
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 32,
              color: "#fff",
              lineHeight: 80
            }}
          >
            Twoje zadania
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: "10%",
    backgroundColor: "#238e8c"
  },
  choresArea: {
    height: 120,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "white",
    justifyContent: "center"
  },
  addTaskText: {
    color: "white",
    lineHeight: 30,
    fontSize: 30,
    fontStyle: "italic",
    textAlign: "center",
    flex: 1,
    fontWeight: "bold"
  },
  addTaskIconWrapper: {
    borderLeftColor: "white",
    borderLeftWidth: 4,
    width: "20%"
  },
  addTaskIcon: {
    lineHeight: 120,

    textAlign: "center"
  }
});
const mapStateToProps = state => {
  return {
    loggedUser: state.user.loggedUser,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArguesScreen);
