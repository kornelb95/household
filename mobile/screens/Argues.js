import React, { Component } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { List, TouchableRipple } from "react-native-paper";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
class ArguesScreen extends Component {
  state = {};
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Header />
          <View style={styles.choresArea}>
            <List.Section>
              <List.Subheader style={{ fontSize: 20 }}>
                Dostępni gracze
              </List.Subheader>
              {this.props.gameRoom
                .filter(
                  member => member.user.userId !== this.props.loggedUser.userId
                )
                .map(member => (
                  <List.Item
                    key={member.user.userId}
                    title={member.user.name}
                    right={props => (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableRipple
                          rippleColor="rgba(0, 0, 0, .32)"
                          onPress={() => console.log("dasdasdas")}
                          style={{
                            fontSize: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingRight: 20
                          }}
                        >
                          <Ionicons
                            name="ios-rocket"
                            color="#D916AB"
                            size={24}
                          />
                        </TouchableRipple>
                      </View>
                    )}
                  />
                ))}
            </List.Section>
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
    isLoading: state.ui.isLoading,
    gameRoom: state.game.roomMembers
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArguesScreen);
