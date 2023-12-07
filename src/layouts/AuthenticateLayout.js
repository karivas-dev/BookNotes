import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Messages } from '../components/Messages';
import { useNavigation } from '@react-navigation/native';

export const AuthenticateLayout = (props) => {
    const navigation = useNavigation();
  
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
            className="flex-1 px-6 py-4 bg-[#e5ddd2]"
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
        </View>
    );
}