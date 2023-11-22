import {Pressable, Text, View, FlatList, ActivityIndicator, Alert} from 'react-native';
import { useState,useCallback } from 'react';
import {AuthenticateLayout} from '../layouts/AuthenticateLayout';
import {Card} from '../components/Card';
import { Messages } from '../components/Messages';
import {useNavigation} from '@react-navigation/native';
import {userLogoutAttempt} from '../hooks/AuthApi';
import {getAuthToken} from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBooks } from '../hooks/BookApi';
import { PrimaryButton } from '../components/PrimaryButton';

export const HomePage = () => {
    const navigation = useNavigation();
    const tok = async() => {
        await getAuthToken();
    }

    const userLogOut = userLogoutAttempt();

    const handleLogOut = () => {
        userLogOut.mutateAsync();
    }

    const [page, setPage] = useState(1)
    const {data, isLoading, isError, isFetching, error, books} = getBooks(page);

    const indexOptions  = [
        {icon:<MaterialCommunityIcons name="menu" size={24} color="white" />, name:'Categorías', route:'CategoriesList'},
        {icon:<MaterialCommunityIcons name="account" size={24} color="white" />, name:'Autores', route:'AuthorsList'},
        {icon:<MaterialCommunityIcons name="book" size={24} color="white" />, name:'Libros', route:'CreateLibrary'} ,
    ];

    const renderOption = useCallback(({ item: option }) => {
        return (
            <Card>
                <View className="flex flex-row py-2 px-2">
                    <View className="">
                        {option.icon}
                    </View>

                    <View className="grow ml-2">
                        <Pressable onPress={() => (navigation.navigate(option.route))}> 
                            <Text className="text-gray-200 text-md font-bold ">
                                {option.name}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Card>
        );
    }, []);

    const renderItem = useCallback(({ item: book }) => {
        return (
            <Card>
                <View className="flex flex-row py-2" >
                    <View className="grow ml-4">
                        <Text className="text-gray-200 text-md font-bold ">
                            {book.name}
                        </Text>
                        <Text className="text-gray-200 text-md font-bold ">
                            {book.author}
                        </Text>
                    </View> 

                    <View className="">
                        <Pressable onPress={() => (navigation.navigate('DetailBook', { id:book.id }))}>
                            <MaterialIcons name="arrow-forward-ios" 
                            size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
            </Card>
        );
    }, []);

    const ListFooterComponentBrands = () => {
        if(data?.links?.next != null){
            return (
                <View className="mt-2">
                    <PrimaryButton message={'load more'} onPress={ () =>  setPage(page + 1) }></PrimaryButton>
                </View>
            )        
        }
    };

    return (
        <AuthenticateLayout>
            <View className="flex flex-1 flex-col justify-center items-center ">

                <View className="w-full max-w-sm">
                    { userLogOut.isLoading ? (
                        <ActivityIndicator size="large" style={{marginVertical: 16}} color="white"/>) : (
                        <View>
                            { userLogOut.isError ? (
                                <Messages message={`Here was a problem processing Logout : ${userLogOut.error}`} level={'error'}/>
                            ) : null }
                        </View>)}
                </View>

                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-800 mt-5 text-3xl">Añadir nuevos</Text>
                        <View className="justify-end mt-5 mb-6">
                            <Pressable 
                                className="px-2.5 py-2.5 rounded-full bg-[#ff6262] focus:bg-[#ff6262] focus:ring-[#ff6262]"
                                onPress={() => (handleLogOut())}
                            >
                                <MaterialCommunityIcons name="logout" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View> 

                    <FlatList vertical={true}
                        data={indexOptions} 
                        renderItem={ renderOption }
                        keyExtractor={(item, index) => index}
                        ItemSeparatorComponent={() => {return (<View className="ml-4"/>);}}
                        style={{ flex: 1 }} 
                    />
                </View>
            </View>
        </AuthenticateLayout>
    ); 
}