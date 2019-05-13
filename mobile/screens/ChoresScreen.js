import React, { Component } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { Subscription, withApollo } from "react-apollo";
import { fetchAllFamilyTasks } from "../store/actions/tasks";
import Header from "../components/Header";
import AddTaskButton from "../components/AddTaskButton";
import TaskList from "../components/TaskList";

const TASK_REFRESHED_SUBSCRIPTION = gql`
  subscription {
    taskRefreshed
  }
`;

class ChoresScreen extends Component {
  componentWillUnmount() {
    this.props.client.stop();
  }
  render() {
    const { tasks, loggedUser } = this.props;
    const freeTasks = tasks.filter(({ executor }) => executor === null);
    const myTasks = tasks.filter(({ executor, finished, toAccept }) => {
      if (executor !== null) {
        return executor._id === loggedUser.userId && !finished && !toAccept;
      }
    });

    const tasksToAccept = tasks.filter(({ executor, toAccept, finished }) => {
      if (executor !== null) {
        return executor._id !== loggedUser.userId && toAccept && !finished;
      }
    });
    const myTasksForAccept = tasks.filter(
      ({ executor, toAccept, finished }) => {
        if (executor !== null) {
          return executor._id === loggedUser.userId && toAccept && !finished;
        }
      }
    );
    const finishedTasks = tasks.filter(({ executor, toAccept, finished }) => {
      if (executor !== null) {
        return executor._id === loggedUser.userId && toAccept && finished;
      }
    });
    return (
      <ScrollView>
        <View style={styles.container}>
          <Header />
          <Subscription
            subscription={TASK_REFRESHED_SUBSCRIPTION}
            onSubscriptionData={opts =>
              this.props.onFetchAllFamilyTasks(this.props.family._id)
            }
          >
            {({ data, loading }) => null}
          </Subscription>

          <View style={styles.choresArea}>
            <Text style={styles.addTaskText}>Dodaj zadanie</Text>
            <AddTaskButton
              navigate={this.props.navigation.navigate}
              family={this.props.family}
            />
          </View>
          <View style={styles.taskListContainer}>
            <TaskList
              freeTasks={freeTasks}
              myTasks={myTasks}
              tasksToAccept={tasksToAccept}
              myTasksForAccept={myTasksForAccept}
              finishedTasks={finishedTasks}
            />
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
    tasks: state.task.tasks,
    family: state.user.family
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchAllFamilyTasks: familyId => dispatch(fetchAllFamilyTasks(familyId))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withApollo(ChoresScreen));
