import { FETCH_FAMILY_MEMBERS } from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "./ui";
const uri = "http://192.168.1.12:8000/graphql";
export const fetchUsersFamilyMembers = id => {
  return dispatch => {
    dispatch(uiStartLoading());
    const requestBody = {
      query: `
        query GetUserById($id: String!) {
          getUserById(id: $id) {
            family {
              creator {
                _id
                name
              }
              members {
                _id
                name
              }
            }
          }
        }
      `,
      variables: {
        id
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
          console.log(parsedRes);
          dispatch(uiStopLoading());
          dispatch({
            type: FETCH_FAMILY_MEMBERS,
            family: parsedRes.data
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};
