import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HomePage } from "../screens/HomePage";

//import {CreateEditOwner} from "../screens/Owners/CreateEditOwner";
//import {DetailOwner} from '../screens/Owners/DetailOwner';
import { BooksList } from "../screens/BooksList";

import { Login } from "../screens/Login";
import { ResetPassword } from "../screens/ResetPassword";

import { user } from "../context/UserAttributesContext";
import {useNavigation} from "@react-navigation/native";


const Tab = createBottomTabNavigator();
const screenOptionsTabStyle = {
    headerShown:false,
    tabBarStyle:{
        backgroundColor:'#374A7A',
        height:60,
        borderTopWidth: 0,
    }
}
const BottomTabItemIcon = (IconLib,size, name, focused) => {
    return (<IconLib size={24} name={name} color={focused ? '#6987B7': 'white'}/>)
}

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={screenOptionsTabStyle}
        >
            <Tab.Screen
                name="HomePage"
                component={HomePage}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({focused}) => (
                        <AntDesign name="home" color={focused ? '#6987B7': 'white'} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="BooksList"
                component={BooksList}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({focused}) => (
                        <MaterialIcons  name="format-list-bulleted"  size={24} color={focused ? '#6987B7': 'white'} />
                    ),
                }}
                initialParams={{level: '', flashMessage: '',page: 1}}
            />
            
        </Tab.Navigator>
    )
}

const Stack = createStackNavigator();
const screenOptionsStyle = {
    headerShown:false
}

export const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionsStyle}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            {/*

            <Stack.Screen name="BranchDetail" component={BranchDetail}/>

            <Stack.Screen name="CreateEditOwner" component={CreateEditOwner} />
            <Stack.Screen name="DetailOwner" component={DetailOwner} />
            <Stack.Screen name="BrandsList" component={BrandsList} initialParams={{level: '', flashMessage: ''}}/>
            <Stack.Screen name="DetailBrand" component={DetailBrand} initialParams={{level: '', flashMessage: '', page: 1}}/>
            <Stack.Screen name="CreateEditBrand" component={CreateEditBrand} />
            */
            }
        </Stack.Navigator>
    )
};



