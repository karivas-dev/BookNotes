import {ActivityIndicator, Image, Pressable, Text, View} from 'react-native';
import {GuestLayout} from '../layouts/GuestLayout';
import {PrimaryButton} from '../components/PrimaryButton';
import {userLoginAttempt, userLoginWithGoogleAttempt, userLoginWithGoogleSubAttempt} from '../hooks/AuthApi';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {FormikInput} from "../components/FormikInput";
import {useEffect, useState} from "react";

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {Messages} from "../components/Messages";
import {useNavigation} from "@react-navigation/native";
import {getAuthIsAdmin, getAuthToken, getAuthType} from "../context/AuthContext";
import {user} from "../context/UserAttributesContext";

WebBrowser.maybeCompleteAuthSession();

export const Login = () => {
    const [googleLoginMessage, setGoogleLoginMessage] = useState(null);
    const navigation = useNavigation();
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID
    });

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await getAuthToken();
                // Si existe un token, el usuario ya ha iniciado sesión, navega al flujo principal
                if (token) {
                    user.isAdmin = await getAuthIsAdmin();
                    user.type = await getAuthType();
                    navigation.navigate('Home', {screen: 'HomePage'});
                }
            } catch (error) {
                console.error('Error al verificar el estado de inicio de sesión: ', error);
            }
        }
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            loginGoogleAttempt.mutateAsync(response.authentication.accessToken);
        }
    }, [response]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required().email(),
            password: Yup.string().required(),
        }),
        onSubmit: async (user) => await loginAttempt.mutateAsync(user)
    });
    const loginAttempt = userLoginAttempt(formik.setErrors);
    const loginWithGoogleSubAttempt = userLoginWithGoogleSubAttempt();
    const loginGoogleAttempt = userLoginWithGoogleAttempt(setGoogleLoginMessage, loginWithGoogleSubAttempt);

    return (
        <GuestLayout>
            <View className="items-center justify-center">
                <Image
                    className="w-32 h-32 rounded-full"
                    source={{
                        uri: 'https://static-00.iconduck.com/assets.00/patreon-icon-2048x2048-f80b89j2.png',
                    }}
                />
            </View>

            <Text className="text-5xl font-bold mb-6 text-gray-200 mt-5">Sign In</Text>
            {/* form */}
            <FormikInput valueName="email" formik={formik} placeholder="Enter your email" />
            <FormikInput valueName="password" formik={formik} placeholder="Enter your password" passEntry={true}/>

            <View className="flex flex-row justify-between items-center mt-3">
                <Pressable>
                    <Text
                        className="underline text-sm text-gray-200 hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pinkC-400">
                        Reset Password
                    </Text>
                </Pressable>
            </View>

            <View className="flex flex-row justify-between mt-5">
                <PrimaryButton onPress={formik.handleSubmit} message='Log In'/>
                <PrimaryButton onPress={() => promptAsync()} message='Google Log In'/>
            </View>

            {googleLoginMessage == null ? null : (
                <Messages level="error" message={googleLoginMessage}/>
            )}

            {formik.isSubmitting ? (
                <ActivityIndicator size="large" style={{marginVertical: 16}} color="white"/>
            ) : null}
        </GuestLayout>
    );
}