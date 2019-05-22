import React, { Component } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { List, TouchableRipple } from "react-native-paper";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { startGameEmit } from "../socket";
import { startGame } from "../store/actions/game";
class ArguesScreen extends Component {
  render() {
    const freeTasks = this.props.tasks.filter(
      ({ executor }) => executor === null
    );
    return (
      <ScrollView>
        <View style={styles.container}>
          <Header />
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 20,
              color: "#fff",
              lineHeight: 24,
              marginTop: 20
            }}
          >
            Wybierz zadanie do gry
          </Text>
          <View style={styles.taskListContainer}>
            <List.Section>
              {freeTasks.map(task => (
                <List.Item
                  style={
                    this.props.gameRoom.task._id === task._id
                      ? { opacity: 0.5 }
                      : null
                  }
                  right={props => (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableRipple
                        rippleColor="rgba(0, 0, 0, .32)"
                        onPress={() => {
                          this.props.chooseTask(task);
                        }}
                      >
                        <List.Icon
                          {...props}
                          icon="check"
                          color={
                            Date.now() - new Date(task.deadline).getTime() > 0
                              ? "#aaa"
                              : "#D916AB"
                          }
                        />
                      </TouchableRipple>
                    </View>
                  )}
                  key={task._id}
                  title={`${task.title}: ${task.points} pkt`}
                />
              ))}
            </List.Section>
          </View>
          <View style={styles.choresArea}>
            <List.Section>
              <List.Subheader style={{ fontSize: 20 }}>
                Dostępni gracze
              </List.Subheader>
              {this.props.gameRoom.roomMembers
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
                          onPress={() => {
                            startGameEmit(
                              this.props.gameRoom.roomMembers.find(
                                member =>
                                  member.user.userId ===
                                  this.props.loggedUser.userId
                              ),
                              member
                            );
                            this.props.onStartGame();
                          }}
                          disabled={
                            this.props.gameRoom.isGame ||
                            this.props.gameRoom.task === {}
                          }
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
  },
  taskListContainer: {
    width: "100%",
    alignSelf: "flex-start",
    alignContent: "center"
  }
});
const mapStateToProps = state => {
  return {
    loggedUser: state.user.loggedUser,
    isLoading: state.ui.isLoading,
    gameRoom: state.game,
    tasks: state.task.tasks,
    family: state.user.family
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onStartGame: () => dispatch(startGame()),
    chooseTask: task =>
      dispatch({
        type: "CHOOSE_TASK_FOR_GAME",
        payload: task
      })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArguesScreen);
