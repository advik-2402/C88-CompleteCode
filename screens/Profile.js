import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { Alert } from "react-native";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      address: "",
      contactNo: "",
      emailID: "",
      docID: "",
    };
  }

  getUserDetails = () => {
    var user = firebase.auth().currentUser;
    var email = user.email;

    db.collection("users")
      .where("EmailID", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailID: data.EmailID,
            firstname: data.FirstName,
            lastname: data.LastName,
            address: data.Address,
            contactNo: data.ContactNo,
            docID: doc.id,
          });
        });
      });
  };

  componentDidMount() {
    this.getUserDetails();
  }

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docID).update({
      FirstName: this.state.firstname,
      LastName: this.state.lastname,
      Address: this.state.address,
      ContactNo: this.state.contactNo,
    });

    Alert.alert("Profile Updated Successfully!");
  };

  render() {
    return (
      <View>
        <MyHeader title="Settings" navigation={this.props.navigation} />

        <View>
          <TextInput
            placeholder={"First Name"}
            maxLength={10}
            onChangeText={(text) => {
              this.setState({
                firstname: text,
              });
            }}
            value={this.state.firstname}
          ></TextInput>

          <TextInput
            placeholder={"Last Name"}
            maxLength={10}
            onChangeText={(text) => {
              this.setState({
                lastname: text,
              });
            }}
            value={this.state.lastname}
          ></TextInput>

          <TextInput
            placeholder={"Address"}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          ></TextInput>

          <TextInput
            placeholder={"Contact Number"}
            maxLength={10}
            keyboardType={"numeric"}
            onChangeText={(text) => {
              this.setState({
                contactNo: text,
              });
            }}
            value={this.state.contactNo}
          ></TextInput>

          <TouchableOpacity
            onPress={() => {
              this.updateUserDetails();
            }}
          >
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
