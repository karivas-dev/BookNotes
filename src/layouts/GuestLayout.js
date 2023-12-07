import { View } from 'react-native';
import React from 'react';
import { StatusBar } from "expo-status-bar";

export const GuestLayout = (props) => {

    return (
        <View className="flex-1 items-center justify-center px-6 py-4 bg-[#e5ddd2]">
            <View className="p-8 w-full max-w-sm">
                {props.children}
            </View>
            
            <StatusBar
                backgroundColor="#333333"
            />
        </View>
    );

}