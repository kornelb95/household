import React from "react";
import { TextInput, StyleSheet } from "react-native";

const defaultInput = props => (
  <TextInput
    underlineColorAndroid="transparent"
    placeholderTextColor="#fff"
    {...props}
    style={[
      styles.input,
      props.style,
      !props.valid && props.touched ? styles.invalid : null
    ]}
  />
);

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#eee",
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    color: "#fff"
  },
  invalid: {
    borderColor: "red"
  }
});

export default defaultInput;
