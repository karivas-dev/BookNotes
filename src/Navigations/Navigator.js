import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Login } from "../screens/Login";
import { HomePage } from "../screens/HomePage";

import { BooksList } from "../screens/books/BooksList";

import { CreateCategory } from "../screens/categories/CreateCategory";
import { CategoriesList } from '../screens/categories/CategoriesList';

import { CreateAuthor } from "../screens/authors/CreateAuthor";
import { AuthorsList } from '../screens/authors/AuthorsList';

import { CreateLibrary } from "../screens/libraries/CreateLibrary";
import { LibrariesList } from '../screens/libraries/LibrariesList';

import { WishesList } from '../screens/wishes/WishesList';

const Tab = createBottomTabNavigator();
const screenOptionsTabStyle = {
    headerShown:false,
    tabBarStyle:{
        backgroundColor:'#cbbbaf',
        height:60,
        borderTopWidth: 0,
    }
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
                        <MaterialCommunityIcons name="home" color={focused ? '#ff6262': 'white'} size={24} />
                    ),
                }}
            />

            <Tab.Screen
                name="Library"
                component={LibrariesList}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({focused}) => (
                        <MaterialCommunityIcons name="bookshelf" color={focused ? '#ff6262': 'white'} size={24} />
                    ),
                }}
                initialParams={{level: '', flashMessage: '',page: 1}}
            />  

            <Tab.Screen
                name="WishesList"
                component={WishesList} 
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({focused}) => (
                        <MaterialCommunityIcons  name="heart"  size={24} color={focused ? '#ff6262': 'white'} />
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
            
            <Stack.Screen name="CategoriesList" component={CategoriesList} initialParams={{level: '', flashMessage: ''}}/>
            <Stack.Screen name="AuthorsList" component={AuthorsList} initialParams={{level: '', flashMessage: ''}}/>
            <Stack.Screen name="LibrariesList" component={LibrariesList} initialParams={{level: '', flashMessage: ''}}/>
                     
            <Stack.Screen name="CreateLibrary" component={CreateLibrary} initialParams={{ id: "", name: "" }}/>
            <Stack.Screen name="CreateCategory" component={CreateCategory} />
            <Stack.Screen name="CreateAuthor" component={CreateAuthor} />
        </Stack.Navigator>
    )
};
