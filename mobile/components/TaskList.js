import React from "react";
import { View } from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import { Notifications } from "expo";
import { List, TouchableRipple } from "react-native-paper";
import {
  bookTask,
  deleteTask,
  finishedTask,
  acceptTask
} from "../store/actions/tasks";
class TaskList extends React.Component {
  render() {
    const {
      freeTasks,
      tasksToAccept,
      myTasksForAccept,
      finishedTasks,
      myTasks
    } = this.props;
    return (
      <>
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
                            time: new Date(task.deadline).getTime() - 3600000
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
                    <TouchableRipple
                      rippleColor="rgba(0, 0, 0, .32)"
                      onPress={() => this.props.onFinishedTask(task._id)}
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
          title={`Zadania do zaakceptowania (${tasksToAccept.length})`}
          left={props => <List.Icon {...props} icon="assignment" />}
        >
          {tasksToAccept.map(task => {
            return (
              <List.Item
                description={task.executor.name}
                right={props => (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableRipple
                      rippleColor="rgba(0, 0, 0, .32)"
                      onPress={() =>
                        this.props.onAcceptTask(
                          task._id,
                          this.props.family._id,
                          this.props.loggedUser.userId
                        )
                      }
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
            );
          })}
        </List.Accordion>
        <List.Accordion
          title={`Czekające na zaakceptowanie (${myTasksForAccept.length})`}
          left={props => <List.Icon {...props} icon="assignment" />}
        >
          {myTasksForAccept.map(task => {
            return (
              <List.Item
                description={task.executor.name}
                key={task._id}
                title={`${task.title}: ${task.points} pkt`}
              />
            );
          })}
        </List.Accordion>
        <List.Accordion
          title={`Moje ukończone zadania (${finishedTasks.length})`}
          left={props => <List.Icon {...props} icon="assignment" />}
        >
          {finishedTasks.map(task => {
            return (
              <List.Item
                description={task.executor.name}
                key={task._id}
                title={`${task.title}: ${task.points} pkt`}
              />
            );
          })}
        </List.Accordion>
      </>
    );
  }
}
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
    onBookTask: (taskId, executorId) => dispatch(bookTask(taskId, executorId)),
    onDeleteTask: taskID => dispatch(deleteTask(taskID)),
    onFinishedTask: taskID => dispatch(finishedTask(taskID)),
    onAcceptTask: (taskID, familyID, userID) =>
      dispatch(acceptTask(taskID, familyID, userID))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
