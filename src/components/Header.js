import { View } from 'react-native'
import React from 'react';
import { Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export const Header = ({navigation}) => {
    return(
        <View className="flex flex-row justify-start mt-5">           
            <Pressable onPress={ () => navigation.goBack()}>
                <AntDesign name="arrowleft" size={36} color="gray" />
            </Pressable>
        </View>
    )
}

