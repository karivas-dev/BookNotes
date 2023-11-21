import { View,Text } from "react-native";
import { GuestLayout } from "../layouts/GuestLayout";
import { PrimaryButton } from '../components/PrimaryButton';
import {TxtInput }from '../components/TxtInput'

export const ResetPassword = () => {

    return (

        <GuestLayout>

            <Text className="text-5xl font-bold text-gray-200 mb-6">Reset Your Password</Text>
            
            <Text className="text-gray-200 mb-6 text-justify">
                Forgotten your account password? Enter your email address below and you'll recieve a link
                to create a new one.
            </Text>

            <TxtInput placeholder="Enter your Email"/> 

            <View className="block w-full">
                <PrimaryButton message='Reset Password'/>
            </View>

        </GuestLayout>

    )

}