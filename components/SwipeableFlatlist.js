import React, { Component } from "react";
import { Dimensions } from "react-native";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";

export default class SwipeableFlatlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifs: this.props.allNotifs,
    };
  }

  onSwipeValueChange = (swipeData) => {
    var allNotifs = this.state.allNotifs;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotifs];
      this.updateMarkAsRead(allNotifs[key]);
      newData.splice(key, 1);
      this.setState({
        allNotifs: newData,
      });
    }
  };

  renderItem = (data) => {
    <ListItem
      leftElement={<Icon name="Book" type="font-awesome" color="#696969" />}
      title={data.item.book_name}
      titleStyle={{ color: "black", fontWeight: "bold" }}
      subtitle={data.item.message}
      bottomDivider
    />;
  };

  renderHiddenItem = () => {
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}></Text>
      </View>
    </View>;
  };

  updateMarkAsRead = (notifications) => {
    db.collection("allNotifs").doc(notifications.doc_id).update({
      notifications_status: "read",
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableLeftSwipe
          data={this.state.allNotifs}
          renderItem={this.renderItem()}
          renderHiddenItem={this.renderHiddenItem()}
          leftOpenValue={Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange()}
        ></SwipeListView>
      </View>
    );
  }
}
