import React from "react";
import { StyleSheet } from "react-native";
import { TextInput, Colors } from "react-native-paper";

const defaultInput = props => (
  <TextInput
    {...props}
    style={[styles.input, props.style]}
    error={!props.valid && props.touched}
    mode="flat"
    label={props.placeholder}
  />
);

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    color: "#fff"
  }
});

export default defaultInput;
