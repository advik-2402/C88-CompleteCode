import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import { Icon, ListItem } from "react-native-elements";

export default class MyDonations extends Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      donorName: "",
      allDonations: [],
    };
    this.requestRef = null;
  }

  sendNotifs = (bookDetails, requestStatus) => {
    var requestID = bookDetails.request_id;
    var donorID = bookDetails.donor_id;
    db.collection("all_notifs")
      .where("requestID", "--", requestID)
      .where("donorID", "--", donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach(() => {
          var message = "";
          if (requestStatus === "bookSent") {
            message = this.state.donorName + "sent you a book!";
          } else {
            message =
              this.state.donorName + "has shown interest in donating the book";
          }
          db.collection("all_notifs").doc(doc.id).update({
            message: message,
            notification: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendBook = (bookDetails) => {
    if (bookDetails.request_status === bookSent) {
      var request_status = "donorInterested";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "donorInterested",
      });
      this.sendNotifs(bookDetails, requestStatus);
    } else {
      var request_status = "bookSent";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "bookSent",
      });
      this.sendNotifs(bookDetails, requestStatus);
    }
  };

  getAllDonations = () => {
    this.requestRef = db
      .collection("allDonations")
      .where("donorID", "==", this.state.userID)
      .onSnapshot((snapshot) => {
        var allDonations = snapshot.docs.map((document) => {
          document.data();
        });

        this.setState({
          allDonations: allDonations,
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={
          "Requested By:" + item.requestedBy + "\nStatus:" + item.requestStatus
        }
        leftElement={<Icon name="book" type="font-awesome" color="red" />}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.request_status === "bookSent" ? "green" : "red",
              },
            ]}
            onPress={this.sendBook(item)}
          >
            <Text style={{ color: "#ffff" }}>
              {item.request_status === "bookSent" ? "Book Sent" : "Send Book"}
            </Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  componentDidMount() {
    this.getAllDonations();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Donations" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requestedBooksList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List of All Book Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
});
