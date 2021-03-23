import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import { SideBar } from "../components/SideBar";
import Profile from "../screens/Profile";
import NotificationScreen from "../screens/NotificationScreen";
import MyDonations from "../screens/MyDonations";
import { Notifications } from "expo";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    MyDonations: {
      screen: MyDonations,
    },
    Notifications: {
      screen: NotificationScreen,
    },
    Setting: {
      screen: Profile,
    },
  },
  { contentComponent: SideBar },
  { initialRouteName: "Home" }
);
