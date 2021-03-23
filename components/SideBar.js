import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from "../config";

export default class SideBar extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docID: "",
    };
  }

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("users_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  selectPicture = async () => {
    const { cancel, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancel) {
      this.setState({
        image: uri,
      });

      this.uploadImage(uri, this.state.userID);
    }
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((uri) => {
        this.setState({ image: uri });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }
  

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View>
        <View
          style={{ flex: 0.5, alignItems: "center", backgroundColor: "yellow" }}
        >
          <Avatar
            rounded
            source={{ uri: this.state.image }}
            size="medium"
            onPress={() => {
              this.selectPicture();
            }}
            containerStyle={styles.imageContainer}
            showEditButton
          />
          <Text
            style={{
              fontWeight: "300",
              fontSize: RFValue(20),
              color: "#fff",
              padding: RFValue(10),
            }}
          >
            {this.state.name}
          </Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  drawerItemsContainer: { flex: 0.8 },
  logOutContainer: { flex: 0.2, justifyContent: "flex-end", paddingBottom: 30 },
  logOutButton: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  logOutText: { fontSize: 30, fontWeight: "bold" },
});
