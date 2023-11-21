import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HomePage } from "../screens/HomePage";

import {CreateEditOwner} from "../screens/Owners/CreateEditOwner";
import {DetailOwner} from '../screens/Owners/DetailOwner';

import { ReplacementsList } from "../screens/Replacements/ReplacementsList";
import { DetailReplacement } from "../screens/Replacements/DetailReplacement";
import { EditCreateReplacement } from "../screens/Replacements/EditCreateReplacement";

import { StoresList } from "../screens/Stores/StoresList";
import { DetailStore } from "../screens/Stores/DetailStore";
import { CreateEditStore } from "../screens/Stores/CreateEditStore";

import { OwnersList } from "../screens/Owners/OwnersList";
import { Login } from "../screens/Login";
import { ResetPassword } from "../screens/ResetPassword";
import {BrandsList} from '../screens/Brands/BrandsList'
import { DetailBrand } from "../screens/Brands/DetailBrand";
import { CreateEditBrand } from "../screens/Brands/CreateEditBrand";
import { DetailModel } from "../screens/Models/DetailModel";
import { CreateEditModel } from "../screens/Models/CreateEditModel";

import { CarsList } from "../screens/Cars/CarsList";
import { DetailCar } from "../screens/Cars/DetailCar";

import { TicketsList } from "../screens/Tickets/TicketsList";
import { DetailTicket } from "../screens/Tickets/DetailTicket";
import { CreateEditCar } from "../screens/Cars/CreateEditCar";

import { CreateEditInventory } from "../screens/Replacements/Partials/Inventory/CreateEditInventory";

import { CreateEditStoreBranch } from "../screens/Stores/Partials/Branches/CreateEditStoreBranch";
import { BranchesList } from "../screens/Branches/BranchesList";
import { DetailStoreBranch } from "../screens/Stores/Partials/Branches/DetailStoreBranch";
import { BranchDetail } from "../screens/Branches/BranchDetail";

import { FormGarage } from "../screens/Garage/FormGarage"; 
import { DetailGarage } from "../screens/Garage/DetailGarage"; 
import { GarageList } from "../screens/Garage/GarageList"; 
import { DetailGarageBranch } from "../screens/Garage/Partials/Branches/DetailGarageBranch";
import { CreateEditGarageBranch } from "../screens/Garage/Partials/Branches/CreateEditGarageBranch";
import { CreateEditTicket } from "../screens/Tickets/CreateEditTicket";
import { DetailTicketBid } from "../screens/Tickets/Partials/Bids/DetailTicketBid";
import { CreateEditTicketBid } from "../screens/Tickets/Partials/Bids/CreateEditTicketBid";
import { user } from "../context/UserAttributesContext";
import { CreateEditBidReplacement } from "../screens/Tickets/Partials/Bids/BidReplacements/CreateEditBidReplacements";
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
                name="BranchesList"
                component={BranchesList}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({focused}) => (
                        <MaterialIcons  name="format-list-bulleted"  size={24} color={focused ? '#6987B7': 'white'} />
                    ),
                }}
                initialParams={{level: '', flashMessage: '',page: 1}}
            />
            {
                user.type == 'Insurer' ? (
                    <Tab.Screen
                        name="CarsList"
                        component={CarsList}
                        options={{
                            tabBarLabel: '',
                            tabBarIcon: ({focused}) => (
                                /* <AntDesign name="car" size={24} color={focused ? '#6987B7': 'white'} /> */
                                BottomTabItemIcon(AntDesign,24,'car',focused) 
                            ),
                        }}
                        initialParams={{level: '', flashMessage: '' , page: 1}}
                    />
                ):null
            }
            {
                user.type == 'Insurer' ? (
                    <Tab.Screen
                        name="OwnersList"
                        component={OwnersList}
                        options={{
                            tabBarLabel: '',
                            tabBarIcon: ({focused}) => (
                                <MaterialIcons name="groups" size={24} color={focused ? '#6987B7': 'white'} />
                            ),
                        }}
                        initialParams={{level: '', flashMessage: '', page: 1}}
                    />
                ):null
            }
            
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

            <Stack.Screen name="BranchDetail" component={BranchDetail}/>

            <Stack.Screen name="CreateEditOwner" component={CreateEditOwner} />
            <Stack.Screen name="DetailOwner" component={DetailOwner} />
            <Stack.Screen name="BrandsList" component={BrandsList} initialParams={{level: '', flashMessage: ''}}/>
            <Stack.Screen name="DetailBrand" component={DetailBrand} initialParams={{level: '', flashMessage: '', page: 1}}/>
            <Stack.Screen name="CreateEditBrand" component={CreateEditBrand} />

            <Stack.Screen name="FormGarage" component={FormGarage} />
            <Stack.Screen name="DetailGarage" component={DetailGarage} />
            <Stack.Screen name="GarageList" component={GarageList} initialParams={{level: '', flashMessage: '', page: 1}}/>
            <Stack.Screen name="CreateEditGarageBranch" component={CreateEditGarageBranch} />
            <Stack.Screen name="DetailGarageBranch" component={DetailGarageBranch} />

            <Stack.Screen name="StoresList" component={StoresList} initialParams={{level: '', flashMessage: '', page: 1}}/>
            <Stack.Screen name="DetailStore" component={DetailStore} initialParams={{level: '', flashMessage: ''}}/>
            <Stack.Screen name="CreateEditStore" component={CreateEditStore} />
            <Stack.Screen name="CreateEditStoreBranch" component={CreateEditStoreBranch} />
            <Stack.Screen name="DetailStoreBranch" component={DetailStoreBranch}/>

            <Stack.Screen name="DetailModel" component={DetailModel} />
            <Stack.Screen name="CreateEditModel" component={CreateEditModel} />
            <Stack.Screen name="DetailCar" component={DetailCar} />
            <Stack.Screen name="CreateEditCar" component={CreateEditCar} />

            <Stack.Screen name="ReplacementsList" component={ReplacementsList} initialParams={{level: '', flashMessage: '', page: 1}}/>
            <Stack.Screen name="DetailReplacement" component={DetailReplacement} initialParams={{level: '', flashMessage: ''}}/>
            <Stack.Screen name="EditCreateReplacement" component={EditCreateReplacement} />
            <Stack.Screen name="CreateEditInventory" component={CreateEditInventory} />

            <Stack.Screen name="TicketsList" component={TicketsList} initialParams={{level: '', flashMessage: '', page: 1}}/>
            <Stack.Screen name="DetailTicket" component={DetailTicket} initialParams={{level: '', flashMessage: ''}} />
            <Stack.Screen name="DetailTicketBid" component={DetailTicketBid}/>
            <Stack.Screen name="CreateEditTicketBid" component={CreateEditTicketBid}/>
            <Stack.Screen name="CreateEditTicket" component={CreateEditTicket}/>
            <Stack.Screen name="CreateEditBidReplacement" component={CreateEditBidReplacement} initialParams={{page: 1}}/>
        </Stack.Navigator>
    )
};



