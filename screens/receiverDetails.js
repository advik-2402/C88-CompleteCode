import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Card, Icon } from "react-native-elements";

export default class ReceiverDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      receiverID: this.props.navigation.getParam("details")["userID"],
      requestID: this.props.navigation.getParam("details")["requestID"],
      bookName: this.props.navigation.getParam("details")["bookName"],
      reasonToRequest: this.props.navigation.getParam("details")[
        "reasonToRequest"
      ],
      receiverName: "",
      receiverContact: "",
      receiverAddress: "",
      receiverRequestDocID: "",
    };
  }

  updateBookStatus = () => {
    db.collection("AllDonations").add({
      bookName: this.state.bookName,
      requestID: this.state.requestID,
      requestedBy: this.state.receiverName,
      donorID: this.state.userID,
      requestStatus: "Donor Interested!",
    });
  };

  getReceiverRequest = () => {
    db.collection("users")
      .where("EmailID", "==", this.state.receiverID)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().FirstName,
            receiverContact: doc.data().ContactNo,
            receiverAddress: doc.data().Address,
          });
        });
      });
  };

  addNotifs = () => {
    var message =
      this.state.username + "Has Shown Interest in Donating the Book!";
    db.collection("all_notifs").add({
      targetedUserID: this.state.receiverID,
      donorID: this.state.userID,
      requestID: this.state.requestID,
      bookName: this.state.bookName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification: "unread",
      message: message,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            backgroundColor="yellow"
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="black"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              ></Icon>
            }
            centerComponent={{
              text: "donateBooks",
              style: { color: "red", fontSize: 25, fontWeight: "bold" },
            }}
          ></Header>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"BookInformation"} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.bookName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason: {this.state.reasonToRequest}
              </Text>
            </Card>
          </Card>
        </View>
        <View>
          <Card title={"ReceiverInformation"} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverID !== this.state.userID ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateBookStatus();
                this.allNotifs();
                this.props.navigation.navigate("MyDonations");
              }}
            >
              <Text>I Want To Donate!</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cont,
});
