import React from "react";
import { View, Text } from "react-native";
import { Button, Headline, ActivityIndicator } from "react-native-paper";
import { connect } from "react-redux";
import DatePicker from "react-native-datepicker";
import DefaultTextInput from "../components/DefaultTextInput";
import validator from "../helpers/validator";
import { addNewTask } from "../store/actions/tasks";
class addTaskModal extends React.Component {
  state = {
    points: 1,
    inputs: {
      title: {
        value: "",
        valid: false,
        validationRules: {
          notEmpty: true
        },
        touched: false
      },
      deadline: {
        value: "",
        valid: false,
        validationRules: {
          notEmpty: true
        },
        touched: false
      }
    }
  };

  updateStateInput = (input, value) => {
    this.setState(prevState => {
      return {
        inputs: {
          ...prevState.inputs,
          [input]: {
            ...prevState.inputs[input],
            value: value,
            valid: validator(value, prevState.inputs[input].validationRules),
            touched: true
          }
        }
      };
    });
  };
  pointsDecrease = () => {
    if (this.state.points === 1) {
      this.setState({ points: 1 });
    } else {
      this.setState(prevState => {
        return {
          points: prevState.points - 1
        };
      });
    }
  };
  pointsIncrease = () => {
    if (this.state.points === 10) {
      this.setState({ points: 10 });
    } else {
      this.setState(prevState => {
        return {
          points: prevState.points + 1
        };
      });
    }
  };
  render() {
    const family = this.props.family;
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: "10%"
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 30, color: "white" }}>Dodaj zadanie!</Text>
          </View>
          <Headline>Tytuł zadania</Headline>
          <DefaultTextInput
            value={this.state.inputs.title.value}
            placeholder="Wpisz tytuł zadania"
            onChangeText={value => this.updateStateInput("title", value)}
            valid={this.state.inputs.title.valid}
            touched={this.state.inputs.title.touched}
            style={{ marginTop: 10 }}
          />
          <Headline>Liczba punktów</Headline>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 20
            }}
          >
            <Button
              mode="contained"
              color="#D916AB"
              onPress={this.pointsDecrease}
            >
              -
            </Button>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "white"
                }}
              >
                {this.state.points}
              </Text>
            </View>
            <Button
              mode="contained"
              color="#D916AB"
              onPress={this.pointsIncrease}
            >
              +
            </Button>
          </View>
          <Headline>Data zakończenia</Headline>
          <DatePicker
            style={{
              width: "80%",
              alignSelf: "center",
              marginTop: 20
            }}
            androidMode="spinner"
            date={this.state.inputs.deadline.value}
            mode="datetime"
            placeholder="Wybierz datę zakończenia zadania"
            format="YYYY-MM-DD, H:mm:ss"
            minDate={new Date()}
            is24Hour
            confirmBtnText="Zatwierdź"
            cancelBtnText="Zamknij"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36,
                color: "#D916AB",
                height: 60,
                fontSize: 30,
                borderColor: "#D916AB"
              },
              placeholderText: {
                fontSize: 20,
                color: "#fff"
              },
              dateText: {
                color: "#fff",
                fontSize: 20
              }
            }}
            onDateChange={date =>
              this.updateStateInput("deadline", new Date(date).toISOString())
            }
          />
        </View>
        {this.props.isLoading ? (
          <ActivityIndicator />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignContent: "flex-end"
            }}
          >
            <Button
              mode="outlined"
              color="#D916AB"
              onPress={() => this.props.navigation.goBack()}
              style={{ marginBottom: "10%" }}
            >
              Wróc
            </Button>
            <Button
              mode="contained"
              color="#D916AB"
              onPress={() => {
                this.props.onAddNewTask({
                  points: this.state.points,
                  title: this.state.inputs.title.value,
                  deadline: this.state.inputs.deadline.value,
                  familyID: family._id
                });
              }}
              style={{ marginBottom: "10%" }}
              disabled={
                !this.state.inputs.title.valid ||
                !this.state.inputs.deadline.valid
              }
            >
              Dodaj
            </Button>
          </View>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    loggedUser: state.user.loggedUser,
    family: state.user.family
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAddNewTask: taskData => dispatch(addNewTask(taskData))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(addTaskModal);
