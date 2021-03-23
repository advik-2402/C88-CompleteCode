import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import BookDonateScreen from "../screens/BookDonateScreen";
import ReceiverDetails from "../screens/receiverDetails";

export const AppStackNavigator = createStackNavigator(
  {
    BookDonateList: {
      screen: BookDonateScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ReceiverDetails: {
      screen: ReceiverDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: BookDonateList,
  }
);
