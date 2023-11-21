import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Messages } from '../components/Messages';
import { StatusBar } from "expo-status-bar";
import { useNavigation } from '@react-navigation/native';

export const AuthenticateLayout = (props) => {
    const navigation = useNavigation();
    //flash message 
    useEffect(() => {
        if (props.level) {
            const timer = setTimeout(() => {
                navigation.setParams({ level: '', flashMessage: ''});
            }, 3000);
    
          return () => clearTimeout(timer);
        }
    }, [props.level]);
    
    return (
        <View 
            className="flex-1 px-6 py-4 bg-blueC-600 "
        >

            {
                props.level != '' && props.flashMessage != ''  && (
                    //centrarlo pero funciona xd
                    <View className="w-full max-w-sm">
                        <Messages level={props.level} message={props.flashMessage} />
                    </View>

                )
            }

            {props.children}
            {/* <StatusBar
                backgroundColor="#22325B"
            /> */}
        </View>

    );

}