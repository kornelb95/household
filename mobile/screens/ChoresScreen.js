import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Notifications } from "expo";
import { connect } from "react-redux";
import { List, TouchableRipple } from "react-native-paper";
import {
  fetchAllFamilyTasks,
  bookTask,
  deleteTask
} from "../store/actions/tasks";
import Header from "../components/Header";
class ChoresScreen extends Component {
  state = {};
  componentDidMount() {
    if (this.props.family !== null) {
      this.props.onFetchAllFamilyTasks(this.props.family._id);
    }
  }

  render() {
    const myTasks = this.props.tasks.filter(task => {
      if (task.executor !== null) {
        return task.executor._id === this.props.loggedUser.userId;
      }
    });
    const freeTasks = this.props.tasks.filter(task => task.executor === null);
    return (
      <ScrollView>
        <View style={styles.container}>
          <Header />
          <View style={styles.choresArea}>
            <Text style={styles.addTaskText}>Dodaj zadanie</Text>
            {this.props.family === null ? (
              <View
                style={[
                  styles.addTaskIconWrapper,
                  { width: "40%", paddingLeft: 15 }
                ]}
              >
                <Text style={{ color: "red", fontSize: 18, fontWeight: "900" }}>
                  Najpierw dołącz do rodziny.
                </Text>
              </View>
            ) : (
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
            )}
          </View>
          <View
            style={{
              width: "100%",
              alignSelf: "flex-start",
              alignContent: "center"
            }}
          >
            <List.Accordion
              title={`Zadania wolne (${freeTasks.length})`}
              left={props => <List.Icon {...props} icon="bookmark" />}
            >
              {freeTasks.map(task => {
                return (
                  <List.Item
                    description={
                      Date.now() - new Date(task.deadline).getTime() > 0
                        ? `${moment(task.deadline).format(
                            "YYYY-MM-DD HH:mm"
                          )} - minął termin`
                        : moment(task.deadline).format("YYYY-MM-DD HH:mm")
                    }
                    descriptionStyle={
                      Date.now() - new Date(task.deadline).getTime() > 0
                        ? { color: "red" }
                        : {}
                    }
                    right={props => (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableRipple
                          onPress={() => {
                            this.props.onBookTask(
                              task._id,
                              this.props.loggedUser.userId
                            );
                            Notifications.scheduleLocalNotificationAsync(
                              {
                                title: "Mija termin twojego zadania",
                                body: `${task.title} - ${moment(
                                  task.deadline
                                ).format("YYYY-MM-DD HH:mm")}`
                              },
                              {
                                time:
                                  new Date(task.deadline).getTime() - 3600000
                              }
                            );
                          }}
                          disabled={
                            Date.now() - new Date(task.deadline).getTime() > 0
                          }
                          rippleColor="rgba(0, 0, 0, .32)"
                        >
                          <List.Icon
                            {...props}
                            icon="launch"
                            color={
                              Date.now() - new Date(task.deadline).getTime() > 0
                                ? "#aaa"
                                : "#D916AB"
                            }
                          />
                        </TouchableRipple>
                        <TouchableRipple
                          rippleColor="rgba(0, 0, 0, .32)"
                          onPress={() => this.props.onDeleteTask(task._id)}
                        >
                          <List.Icon {...props} icon="delete" color="#D916AB" />
                        </TouchableRipple>
                      </View>
                    )}
                    key={task._id}
                    title={`${task.title}: ${task.points} pkt`}
                  />
                );
              })}
            </List.Accordion>

            <List.Accordion
              title={`Moje zadania (${myTasks.length})`}
              left={props => <List.Icon {...props} icon="assignment" />}
            >
              {myTasks.map(task => {
                return (
                  <List.Item
                    description={
                      Date.now() - new Date(task.deadline).getTime() > 0
                        ? `${moment(task.deadline).format(
                            "YYYY-MM-DD HH:mm"
                          )} - minął termin`
                        : moment(task.deadline).format("YYYY-MM-DD HH:mm")
                    }
                    descriptionStyle={
                      Date.now() - new Date(task.deadline).getTime() > 0
                        ? { color: "red" }
                        : {}
                    }
                    right={props => (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableRipple rippleColor="rgba(0, 0, 0, .32)">
                          <List.Icon
                            {...props}
                            icon="launch"
                            color={
                              Date.now() - new Date(task.deadline).getTime() > 0
                                ? "#aaa"
                                : "#D916AB"
                            }
                          />
                        </TouchableRipple>
                        <TouchableRipple
                          rippleColor="rgba(0, 0, 0, .32)"
                          onPress={() => this.props.onDeleteTask(task._id)}
                        >
                          <List.Icon {...props} icon="delete" color="#D916AB" />
                        </TouchableRipple>
                      </View>
                    )}
                    key={task._id}
                    title={`${task.title}: ${task.points} pkt`}
                  />
                );
              })}
            </List.Accordion>
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
    isLoading: state.ui.isLoading,
    tasks: state.task.tasks,
    family: state.user.family
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchAllFamilyTasks: familyId => dispatch(fetchAllFamilyTasks(familyId)),
    onBookTask: (taskId, executorId) => dispatch(bookTask(taskId, executorId)),
    onDeleteTask: taskID => dispatch(deleteTask(taskID))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChoresScreen);
