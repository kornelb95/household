import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { Button } from "react-native-paper";
import DefaultTextInput from "../components/DefaultTextInput";
import { connect } from "react-redux";
import { login } from "../store/actions/user";
import validator from "../helpers/validator";
class LoginScreen extends Component {
  static navigationOptions = {
    title: "Logowanie"
  };
  state = {
    inputs: {
      email: {
        value: "korni007@gmail.com",
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched: false
      },
      password: {
        value: "f0d3f252",
        valid: false,
        validationRules: {
          minLength: 6
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

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
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
          </View>
          <View style={styles.buttonContainer}>
            {this.props.isLoading ? (
              <ActivityIndicator />
            ) : (
              <Button
                mode="contained"
                color="#D916AB"
                onPress={() => this.props.onLogin(this.state.inputs)}
              >
                Zaloguj
              </Button>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    // justifyContent: "center",
    backgroundColor: "#12B2AF"
  },
  errorText: {
    paddingVertical: 10,
    color: "#f00"
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  inputContainer: {
    justifyContent: "center"
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
    onLogin: userData => dispatch(login(userData))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
