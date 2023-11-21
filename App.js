import React, { useEffect, useState } from 'react';
import { NativeWindStyleSheet } from "nativewind";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { QueryClient, QueryClientProvider } from 'react-query';
import axiosRoute from './src/utils/route';
import {StackNavigator} from "./src/Navigations/Navigator";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const queryClient = new QueryClient();
  const [haveToken, setHaveToken] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    await axiosRoute.boot();
  };

  return (
    <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StackNavigator></StackNavigator>
          </NavigationContainer>
    </QueryClientProvider>
  );
}