import {Pressable, Text, View, FlatList, ActivityIndicator, Alert} from 'react-native';
import { useState,useCallback } from 'react';
import {AuthenticateLayout} from '../layouts/AuthenticateLayout';
import {Card} from '../components/Card';
import { Messages } from '../components/Messages';
import {useNavigation} from '@react-navigation/native';
import {userLogoutAttempt} from '../hooks/AuthApi';
import {getAuthIsAdmin, getAuthToken, getAuthType} from '../context/AuthContext';
import { TxtInput } from '../components/TxtInput';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { user } from '../context/UserAttributesContext';
import {useQueryClient} from "react-query";

export const HomePage = () => {
    const navigation = useNavigation();
    const tok = async() => {
        const token = await getAuthToken();
        console.log(token);
    }
    console.log(tok());
    const userLogOut = userLogoutAttempt();

    const handleLogOut = () => {
       Alert.alert('Log Out', 'Are you sure you want to log out ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => {
                    userLogOut.mutateAsync();
                }
            }
        ]);
        userLogOut.mutateAsync();
    }
    const indexOptions  = [
        {icon: <Octicons name="tools" size={24} color="white" /> , name:'Replacements', route:'ReplacementsList'}, 
        {icon:<MaterialIcons name="store" size={24} color="white"/>, name:'Stores', route:'StoresList'}, 
        {icon:<AntDesign name="profile" size={24} color="white" /> ,name:'Brands', route:'BrandsList'}, 
        {icon:<Ionicons name="ios-receipt" size={24} color="white" />, name:'Tickets', route:'TicketsList'},
        {icon:<MaterialCommunityIcons name="garage" size={24} color="white" /> ,name:'Garages', route:'GarageList'},
    ];

    const [search, setSearch] = useState("");
    const [filterOptions, setFilterOptions] = useState(indexOptions);

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if (text.trim().length !== 0) {
            let filteredData = indexOptions.filter((op) => {
                const lowerName = op.name.toLowerCase();
                return (
                    lowerName.includes(textSearch.trim())
                );
            });
            setFilterOptions(filteredData);
        } else {
            setFilterOptions(indexOptions);
        }
    };

    const renderItem = useCallback(({ item: option }) => {
        if(user.type == 'Store' && option.name == 'Tickets'){
            return null;
        }
        return (
            <Card>
                <View className="flex flex-row">
                    <View className="py-3">
                        {option.icon}
                    </View>
                    <View className="grow py-4">
                        <View className="ml-4">
                            <Pressable onPress={() => (
                                 navigation.navigate(option.route),setSearch(""))}
                            > 
                                <Text className="text-gray-200 text-md font-bold ">
                                    {option.name}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Card>
        );
    }, []);

    return (
        <AuthenticateLayout>
            <View className="flex flex-1 flex-col justify-center items-center ">
                <View className="w-full max-w-sm">
                    {userLogOut.isLoading ? (
                        <ActivityIndicator size="large" style={{marginVertical: 16}} color="white"/>) : (<View>
                        
                        {userLogOut.isError ? (
                            <Messages message={`Here was a problem processing Logout : ${userLogOut.error}`} level={'error'}/>
                        ) : null}

                    </View>)}
                </View>
                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-200 mt-5 text-3xl">Welcome Back !</Text>
                        <View className="justify-end mt-5 mb-6">
                            <Pressable 
                                className="px-2.5 py-2.5 rounded-full bg-red-500 hover:bg-red-800 focus:bg-red-800 focus:ring-red-800"
                                onPress={() => (
                                    handleLogOut(),
                                    setSearch(""))
                                }
                            >
                                <MaterialCommunityIcons name="logout" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    {
                        indexOptions.length != 0 ? (
                            <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)}/>
                        ):null
                    }
                    <FlatList horizontal={true}
                        data={search.length == 0 ? indexOptions : filterOptions}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => {return (<View className="ml-4"/>);}}
                        keyExtractor={(item, index) => index}
                        style={{ flex: 1 }}
                    />
                </View>
            </View>
        </AuthenticateLayout>
    ); 
}