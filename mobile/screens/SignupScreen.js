import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { Switch, Button } from "react-native-paper";
import DefaultTextInput from "../components/DefaultTextInput";
import { connect } from "react-redux";
import { signup } from "../store/actions/user";
import validator from "../helpers/validator";
class SignupScreen extends Component {
  static navigationOptions = {
    title: "Zakładanie konta",
    headerStyle: {
      backgroundColor: ""
    }
  };
  state = {
    inputs: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched: false
      },
      password: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 6
        },
        touched: false
      },
      password2: {
        value: "",
        valid: false,
        validationRules: {
          equalTo: "password"
        },
        touched: false
      },
      name: {
        value: "",
        valid: false,
        validationRules: {
          notEmpty: true
        },
        touched: false
      },
      isFamilyCreating: {
        value: false,
        valid: true,
        validationRules: {}
      },
      familyName: {
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
    let connectedValue = {};
    if (this.state.inputs[input].validationRules.equalTo) {
      const equalControl = this.state.inputs[input].validationRules.equalTo;
      const equalValue = this.state.inputs[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      };
    }
    if (input === "password") {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      };
    }
    this.setState(prevState => {
      return {
        inputs: {
          ...prevState.inputs,
          password2: {
            ...prevState.inputs.password2,
            valid:
              input === "password"
                ? validator(
                    prevState.inputs.password2.value,
                    prevState.inputs.password2.validationRules,
                    connectedValue
                  )
                : prevState.inputs.password2.valid
          },
          [input]: {
            ...prevState.inputs[input],
            value: value,
            valid: validator(
              value,
              prevState.inputs[input].validationRules,
              connectedValue
            ),
            touched: true
          }
        }
      };
    });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          {this.props.user.error !== "" ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.errorText}>{this.props.user.error}</Text>
            </View>
          ) : null}
          <DefaultTextInput
            value={this.state.inputs.email.value}
            placeholder="Wpisz adres email"
            keyboardType="email-address"
            onChangeText={value => this.updateStateInput("email", value)}
            valid={this.state.inputs.email.valid}
            touched={this.state.inputs.email.touched}
          />
          <DefaultTextInput
            value={this.state.inputs.password.value}
            secureTextEntry
            placeholder="Wpisz hasło"
            onChangeText={value => this.updateStateInput("password", value)}
            valid={this.state.inputs.password.valid}
            touched={this.state.inputs.password.touched}
          />
          <DefaultTextInput
            value={this.state.inputs.password2.value}
            placeholder="Powtórz hasło"
            secureTextEntry
            onChangeText={value => this.updateStateInput("password2", value)}
            valid={this.state.inputs.password2.valid}
            touched={this.state.inputs.password2.touched}
          />
          <DefaultTextInput
            value={this.state.inputs.name.value}
            placeholder="Twoje imię"
            onChangeText={value => this.updateStateInput("name", value)}
            valid={this.state.inputs.name.valid}
            touched={this.state.inputs.name.touched}
          />
        </View>
        <View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Czy chcesz założyć rodzinę?</Text>
            <Switch
              value={this.state.inputs.isFamilyCreating.value}
              onValueChange={value =>
                this.updateStateInput("isFamilyCreating", value)
              }
            />
          </View>
          {this.state.inputs.isFamilyCreating.value && (
            <DefaultTextInput
              value={this.state.inputs.familyName.value}
              placeholder="Nazwa twojej rodziny"
              onChangeText={value => this.updateStateInput("familyName", value)}
              valid={this.state.inputs.familyName.valid}
              touched={this.state.inputs.familyName.touched}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          {this.props.isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button
              disabled={
                !this.state.inputs.email.valid ||
                !this.state.inputs.password.valid ||
                !this.state.inputs.password2.valid ||
                !this.state.inputs.name.valid
              }
              onPress={() => this.props.onSignup(this.state.inputs)}
              mode="contained"
              color="#D916AB"
            >
              Załóż konto
            </Button>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#12B2AF"
  },
  errorText: {
    paddingVertical: 10,
    color: "#f00"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10%"
  },
  inputContainer: {
    justifyContent: "space-around"
  },
  switchContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  switchText: {
    color: "#fff"
  }
});
const mapStateToProps = state => {
  return {
    user: state.user,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSignup: userData => dispatch(signup(userData))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreen);
