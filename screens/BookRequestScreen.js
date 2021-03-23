import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import { BookSearch } from "react-native-google-books";
import { FlatList } from "react-native-gesture-handler";

export default class BookRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      userDocId: "",
      bookName: "",
      reasonToRequest: "",
      isBookRequestActive: false,
      dataSource: "",
      showFlatlist: false,
    };
  }

  async booksFromApi(bookName) {
    this.setState({
      bookName: bookName,
    });

    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        "AIzaSyDSKMWNjPHsRH99DLcKqYJ-T230B0gnGEU"
      );

      this.setState({
        dataSource: books.data,
        showFlatlist: true,
      });
    }
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  getBookRequest = () => {
    // getting the requested book
    var bookRequest = db
      .collection("requested_books")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedBookName: doc.data().book_name,
              bookStatus: doc.data().book_status,
              docId: doc.id,
            });
          }
        });
      });
  };

  getIsBookRequestActive() {
    db.collection("users")
      .where("EmailID", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              isBookRequestActive: doc.data().isBookRequestActive,
              userDocId: doc.id,
            });
          }
        });
      });
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();

    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyDSKMWNjPHsRH99DLcKqYJ-T230B0gnGEU"
    );

    this.setState({
      dataSource: books.data,
      showFlatlist: true,
    });

    db.collection("requested_books").add({
      user_id: userId,
      book_name: bookName,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      imageLink: books.data[0].volumeInfo.imageLinks.smallThumbnail,
    });

    await this.getBookRequest();
    db.collection("users")
      .where("EmailID", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActive: true,
          });
        });
      });

    this.setState({
      bookName: "",
      reasonToRequest: "",
    });

    return Alert.alert("Book Requested Successfully");
  };

  updateBookStatus = () => {
    db.collection("requested_books")
      .doc(this.state.docId)
      .update({ book_status: "received" });

    db.collection("users")
      .where("EmailID", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users")
            .doc(doc.id)
            .update({ isBookRequestActive: false });
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and book nam
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var bookName = doc.data().book_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the book " + bookName,
                  notification_status: "unread",
                  book_name: bookName,
                });
              });
            });
        });
      });
  };

  receivedBooks = (bookName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_books").add({
      user_id: userId,
      book_name: bookName,
      request_id: requestId,
      bookStatus: "received",
    });
  };

  renderItem = ({ item, i }) => {
    return (
      <TouchableHighlight
        style={{
          alignItems: "center",
          width: "90%",
          padding: 10,
          backgroundColor: "yellow",
        }}
        activeOpacity={0.6}
        underlayColor="orange"
        onPress={() => {
          this.setState({
            bookName: item.volumeInfo.item,
            showFlatlist: false,
          });
        }}
        bottomDivider
      >
        <Text>{item.volumeInfo.item}</Text>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "#696969",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View
            style={{
              borderColor: "#696969",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Book Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderColor: "#696969",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              width: 300,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateBookStatus();
              this.receivedBooks(this.state.requestedBookName);
            }}
          >
            <Text>I have received the book!</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Enter Book Name"}
            onChangeText={(text) => {
              this.setState({
                bookName: text,
              });
            }}
            value={this.state.bookName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              style={{ marginTop: 10 }}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              enableEmptySections={true}
            />
          ) : (
            <View>
              <TextInput
                style={[styles.formTextInput, { height: 300 }]}
                multiline
                numberOfLines={8}
                placeholder={"Why do you need this book?"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.addRequest(
                    this.state.bookName,
                    this.state.reasonToRequest
                  );
                }}
              >
                <Text>Request</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
