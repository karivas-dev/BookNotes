import {logout, saveLoginData} from "../context/AuthContext";
import axiosRoute from "../utils/route";
import {useNavigation} from "@react-navigation/native";
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";

const loginAttempt = (user) =>  axiosRoute.post('login', null, user);

const userLoginAttempt = (formikErrors) => {
    const navigation = useNavigation();
    return useMutation({
        mutationFn: loginAttempt,

        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'password': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: async (data) => {
            await saveLoginData(data.data);
            await axiosRoute.refreshToken();
            navigation.navigate('Home', {screen: 'HomePage'});
        },
    });
}


const logoutAttempt = () => axiosRoute.post('logout');

const userLogoutAttempt = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: logoutAttempt,

        onSuccess: async (data) => {
            await logout();
            await axiosRoute.refreshToken();
            queryClient.clear(); // resetea todos los queries
            navigation.navigate('Login');
        },
        onError: async (error) => {
            await logout();
            await axiosRoute.refreshToken();
            queryClient.clear(); // resetea todos los queries
            navigation.navigate('Login');
        },
        
    });
}

export {userLoginAttempt, userLogoutAttempt};