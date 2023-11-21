import AsyncStorage from '@react-native-async-storage/async-storage';
import {user} from "./UserAttributesContext";

export const saveLoginData = async (data) => {
  try {
    user.isAdmin = data.admin;
    user.type = data.type;
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('type', data.type);
    await AsyncStorage.setItem('admin', data.admin);
  } catch (error) {
    console.error(`Error saving login data: ${error}`);
  }
}

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error(`Error getting auth token: ${error}`);
    return null;
  }
}
export const getAuthType = async () => {
  try {
    return await AsyncStorage.getItem('type');
  } catch (error) {
    console.error(`Error getting auth token: ${error}`);
    return null;
  }
}
export const getAuthIsAdmin = async () => {
  try {
    return await AsyncStorage.getItem('admin');
  } catch (error) {
    console.error(`Error getting auth token: ${error}`);
    return null;
  }
}

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('type');
    await AsyncStorage.removeItem('admin');
    AsyncStorage.clear();
  } catch (error) {
    console.error(`Error logging out: ${error}`);
  }
}