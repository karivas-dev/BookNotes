import { View,Text,FlatList, ActivityIndicator, Pressable } from "react-native"
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { useState, useCallback } from "react";

import { Card } from '../../components/Card';
import { TxtInput } from "../../components/TxtInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { Header } from "../../components/Header";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStores } from "../../hooks/StoreApi";
import { user } from "../../context/UserAttributesContext";
export const StoresList = ({navigation, route}) => {

    //flash message
    const {level, flashMessage, page} = route.params;
    
    const {data, isLoading, isError, isFetching, error, stores} = getStores(page);
    const [filterStores,setFilterStores] = useState(stores);
    const [search, setSearch] = useState('');

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = stores.filter((store) => {
                const lowerName = store.name.toLowerCase();

                return (
                    lowerName.includes(textSearch.trim())
                );
            });
            setFilterStores(filteredData);
        }else{
            setFilterStores(stores);
        }
    }

    const renderItem = useCallback(({item: store}) => {
        return (
            <Card>
                <View className="flex flex-row py-2" >
                    <View className="py-2">
                        <MaterialCommunityIcons name="store-cog" size={30} color="white" />
                    </View>
                    <View className="grow">
                        <View className="ml-4 py-2" >
                            <Text className="text-gray-200 text-md font-bold ">{store.name}</Text>
                        </View>
                    </View>
                    <View className="py-2">
                        <Pressable onPress={() => (navigation.navigate('DetailStore',{ id: store.id }), setSearch(''))}>
                            <MaterialIcons name="arrow-forward-ios" size={30} color="white" />
                        </Pressable>
                    </View>
                </View>
            </Card>
        )
    },[])

    const ListFooterComponentStores= () => {
        if(data?.links?.next != null){
            return (
                <View className="mt-2">
                    <PrimaryButton message={'load more'} onPress={ () => navigation.setParams({ page: page + 1}) }></PrimaryButton>
                </View>
            );
        }
    };

    return (
        <AuthenticateLayout level={level} flashMessage={flashMessage}>
            <Header navigation={navigation}/>
            <View className="flex-1 items-center justify-center">
                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-200 mt-5 text-3xl">Stores</Text>
                        <View className="justify-end mt-5 mb-6">
                            {
                                user.isAdmin && user.type == 'Insurer' ? (
                                    <PrimaryButton onPress={() => (navigation.navigate('CreateEditStore',{ 
                                        storeParms  : {
                                            id: '',
                                            name:'',
                                        }}), setSearch(''))}
                                    message="+ Store"/>
                                ):null
                            }                          
                        </View>
                    </View>
                    {
                        isLoading || isFetching? (
                            null
                        ) : isError ? (
                            <MaterialIcons name="error-outline" size={24} color="white" />
                        ):(
                            <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)}/>
                        )
                    }
                </View>
                <View className="flex-1 w-full max-w-sm">
                    {
                        isLoading || isFetching ? (
                            <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                        ): isError ? (
                            <Messages message={`Here was a problem processing Stores : ${error.message}`} level={'error'}/>
                           
                        ) : stores.length != 0  ? (
                            <FlatList
                                data={search.length == 0 ? stores : filterStores}
                                renderItem={renderItem}
                                keyExtractor={(item) => `${item.id}`}
                                /* ListHeaderComponent={ListHeaderComponentStores} */
                                ListFooterComponent={ListFooterComponentStores}
                                style={{flex: 1}}
                            /> 
                        ) : (
                            <Messages message={'No data of Stores in our records ...'} level={'info'}/>
                        )
                    }
                </View>
            </View>
        </AuthenticateLayout>
    ); 
}