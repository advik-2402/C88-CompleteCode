import React, { Component } from "react";
import { Header, Icon, Badge } from "react-native-elements";
import { View, Text, StyeSheet, Alert } from "react-native";
import { toggleDrawer } from "react-navigation-drawer/lib/typescript/src/routers/DrawerActions";

export default class MyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  noOfUnreadNotifs() {
    db.collection("allNotifs")
      .where("notification_status", "==", "unread")
      .onSnapshot((snapshot) => {
        var unreadNotifs = snapshot.docs.map((doc) => {
          doc.data();
        });
        this.setState({
          value: unreadNotifs.length,
        });
      });
  }
  componentDidMount() {
    this.noOfUnreadNotifs();
  }

  bellIconWithBadge = (props) => {
    return (
      <View>
        <View>
          <Icon
            name="bell"
            size={25}
            type="font-awesome"
            color="#696969"
            onPress={() => {
              props.navigation.navigate("Notifications");
            }}
          />

          <Badge
            value={this.state.value}
            containerStyle={{ position: "absolute", top: -4, right: -4 }}
          />
        </View>
      </View>
    );
    return (
      <Header
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="#696969"
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
          />
        }
        centerComponent={{
          text: props.title,
          style: { color: "#90A5A9", fontSize: 20, fontWeight: "bold" },
        }}
        rightComponent={<bellIconWithBadge {...props} />}
        backgroundColor="#eaf8fe"
      />
    );
  };
}
