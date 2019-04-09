import NavigationService from "../../navigation/NavigationService";
import { uiStartLoading, uiStopLoading } from "./ui";
import { FETCH_ALL_FAMILY_TASKS } from "./actionTypes";
const uri = "http://192.168.1.12:8000/graphql";
export const addNewTask = taskData => {
  return dispatch => {
    const { points, title, deadline, familyID } = taskData;
    const requestBody = {
      query: `
        mutation CreateTask($title: String!, $points: Int!, $deadline: String!, $familyID: String!) {
          createTask(taskInput: {title: $title, points: $points, deadline: $deadline, familyID: $familyID}) {
            _id
            title
            family {
              _id
            }
          }
        }
      `,
      variables: {
        points,
        title,
        deadline,
        familyID
      }
    };
    fetch(uri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(parsedRes => {
        if (parsedRes.errors) {
        } else {
          NavigationService.back();
          return parsedRes.data.createTask.family._id;
        }
      })
      .then(familyID => dispatch(fetchAllFamilyTasks(familyID)))
      .catch(err => {
        console.log(err);
      });
  };
};

export const fetchAllFamilyTasks = familyID => {
  return dispatch => {
    dispatch(uiStartLoading());
    const requestBody = {
      query: `
        query GetFamilyTasks($familyID: String!) {
          getFamilyTasks(familyID: $familyID) {
            _id
            title
            points
            deadline
            executor {
              _id
              name
            }
            family {
              name
            }
            finished
            createdAt
          }
        }
      `,
      variables: {
        familyID
      }
    };
    fetch(uri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(parsedRes => {
        if (parsedRes.data === null) {
          dispatch(uiStopLoading());
        } else {
          dispatch(uiStopLoading());
          dispatch(getTasks(parsedRes.data.getFamilyTasks));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(authError(err));
      });
  };
};

const getTasks = tasks => {
  return {
    type: FETCH_ALL_FAMILY_TASKS,
    tasks
  };
};

export const bookTask = (taskID, executorID) => {
  return dispatch => {
    const requestBody = {
      query: `
        mutation BookTask($taskID: String!, $executorID: String!) {
          bookTask(taskID: $taskID, executorID: $executorID) {
            _id
            family {
              _id
            }
          }
        }
      `,
      variables: {
        taskID,
        executorID
      }
    };
    fetch(uri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(parsedRes => {
        if (!parsedRes.errors) {
          return parsedRes.data.bookTask.family._id;
        }
      })
      .then(familyID => dispatch(fetchAllFamilyTasks(familyID)))
      .catch(err => {
        console.log(err);
      });
  };
};
