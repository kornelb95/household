import React, { Component } from "react";
import {
  View,
  Text,
  Switch,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import DefaultTextInput from "../components/DefaultTextInput";
import { connect } from "react-redux";
import { signup } from "../store/actions/auth";
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
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={180}
        behavior="padding"
      >
        <View style={styles.inputContainer}>
          {this.props.auth.error !== "" ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.errorText}>{this.props.auth.error}</Text>
            </View>
          ) : null}
          <DefaultTextInput
            value={this.state.inputs.email.value}
            style={styles.input}
            placeholder="Wpisz adres email"
            keyboardType="email-address"
            onChangeText={value => this.updateStateInput("email", value)}
            valid={this.state.inputs.email.valid}
            touched={this.state.inputs.email.touched}
          />
          <DefaultTextInput
            value={this.state.inputs.password.value}
            style={styles.input}
            secureTextEntry
            placeholder="Wpisz hasło"
            onChangeText={value => this.updateStateInput("password", value)}
            valid={this.state.inputs.password.valid}
            touched={this.state.inputs.password.touched}
          />
          <DefaultTextInput
            value={this.state.inputs.password2.value}
            style={styles.input}
            placeholder="Powtórz hasło"
            secureTextEntry
            onChangeText={value => this.updateStateInput("password2", value)}
            valid={this.state.inputs.password2.valid}
            touched={this.state.inputs.password2.touched}
          />
          <DefaultTextInput
            value={this.state.inputs.name.value}
            style={styles.input}
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
              style={styles.input}
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
              title="Załóż konto"
              onPress={() => this.props.onSignup(this.state.inputs)}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#4BC9C6"
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
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#eee",
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    color: "#fff"
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
    auth: state.auth,
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
