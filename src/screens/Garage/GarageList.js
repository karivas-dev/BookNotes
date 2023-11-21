import { View, Text, FlatList, ActivityIndicator , TextInput, Pressable} from "react-native"
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { useState, useEffect, useCallback, useDebugValue } from "react";
import {Card} from '../../components/Card';
import { TxtInput } from "../../components/TxtInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { FormGarage } from "./FormGarage";
import {Header} from "../../components/Header";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { getGarages } from "../../hooks/GarageApi";
import { user } from "../../context/UserAttributesContext";

export const GarageList = ({navigation, route}) => {
    const {level, flashMessage} = route.params;
    const [page, setPage] = useState(1);
    const [filterGarages, setFilterGarages] = useState(garages);
    const [search, setSearch] = useState('');

    const {data, isLoading, isError, isFetching, error, garages} = getGarages(page);

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = garages.filter((garage) => {
                const lowerName = garage.name.toLowerCase();
                return (
                    lowerName.includes(textSearch.trim())
                );
            });
            setFilterGarages(filteredData);
        } else{
            setFilterGarages(garages);
        }
    }

    const renderItem = useCallback(({ item:garage}) => {
        return (
            <Card>
                <View className="flex flex-row py-2" >
                    <View className="">
                        <MaterialIcons name="build-circle" size={52} color="#F1F6F5" />
                    </View>
                    <View className="grow mt-4">
                        <View className="ml-4" >
                            <Text className="text-gray-200 text-md font-bold ">{garage.name}</Text>
                        </View>
                    </View>
                    <View className="mt-2">
                        <Pressable onPress={() => (navigation.navigate('DetailGarage', { id:garage.id }),setSearch(''))}>
                            <MaterialIcons name="arrow-forward-ios" size={30} color="white" />
                        </Pressable>
                    </View>
                </View>
                
            </Card>
        )
    }, []);

    const ListFooterComponentGarages = () => {
        if(data?.links?.next != null){
            return (
                <View className="mt-2">
                    <PrimaryButton message={'load more'} onPress={ () =>  setPage(page + 1) }></PrimaryButton>
                </View>
            )
        }
    };

    return (
        <AuthenticateLayout level={level} flashMessage={flashMessage}>
            <Header navigation={navigation} />
            <View className="flex-1 items-center justify-center">
                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-200 mt-5" style={{fontSize:34}}>Garages</Text>
                        {
                            user.isAdmin && user.type == 'Insurer' ? (
                                <View className="justify-end mt-5 mb-6">
                                    <PrimaryButton onPress={() => (navigation.navigate('FormGarage',{id:'' ,name:''}), setSearch(''))} message="+ Garage"/>
                                </View>
                            ):null
                        }
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
                            <Messages message={`THere was a problem processing Garages : ${error.message}`} level={'error'}/>
                            
                        ) : garages ? (
                            <FlatList
                                data={search.length == 0 ? garages : filterGarages}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                                ListFooterComponent={ListFooterComponentGarages}
                                style={{flex: 1}}
                            /> 
                        ): (
                            <Messages message={'No data of Garages in our records ...'} level={'info'}/>
                        )
                    }
                </View>
            </View>
        </AuthenticateLayout>
    )
    
}