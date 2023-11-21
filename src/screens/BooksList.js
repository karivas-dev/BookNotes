import { View, Text, FlatList, ActivityIndicator , TextInput, Pressable} from "react-native"
import { AuthenticateLayout } from '../layouts/AuthenticateLayout';
import { useState, useEffect, useCallback } from "react";
import {Card} from '../components/Card';
import { TxtInput } from "../components/TxtInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { Messages } from "../components/Messages";
import { Header } from "../components/Header";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { user } from "../context/UserAttributesContext";
import { getBook } from "../hooks/BookApi";

export const BrandsList = ({navigation,route}) => {

    //flash message
    const {level, flashMessage} = route.params;

    const [page, setPage] = useState(1)

    const [filterBooks,setFilterBooks] = useState(brands);
    const [search, setSearch] = useState('');

    const {data, isLoading, isError, isFetching, error, brands} = getBook(page);

    const renderItem = useCallback(({ item:brand }) => {
        return (
            <Card>
                <View className="flex flex-row py-2" >
                    <View className="">
                        <FontAwesome name="ticket" size={30} color="white" />
                    </View>
                    <View className="grow">
                        <View className="ml-4" >
                            <Text className="text-gray-200 text-md font-bold ">{brand.name}</Text>
                        </View>
                    </View>
                    <View className="">
                        <Pressable onPress={() => (navigation.navigate('DetailBrand', { id:brand.id }),setSearch(''))}>
                            <MaterialIcons name="arrow-forward-ios" size={30} color="white" />
                        </Pressable>
                    </View>
                </View>

            </Card>
        )
    },[]);

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
        <AuthenticateLayout level={level} flashMessage={flashMessage}>
            <Header navigation={navigation}/>
            <View className="flex-1 items-center justify-center">
                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-200 mt-5 text-3xl">Brands</Text>
                        {
                            user.type != 'Garage' ? (
                                <View className="justify-end mt-5 mb-6">
                                    <PrimaryButton onPress={() => (navigation.navigate('CreateEditBrand',{id:'' ,name:''}), setSearch(''))} message="+ Brand"/>
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
                            <Messages message={`Here was a problem processing Brands : ${error.message}`} level={'error'}/>

                        ) : brands ? (
                            <FlatList
                                data={search.length ==0 ? brands : filterBrands}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                                ListFooterComponent={ListFooterComponentBrands}
                                style={{flex: 1}}
                            />
                        ): (
                            <Messages message={'No data of Brands in our records ...'} level={'info'}/>
                        )
                    }
                </View>
            </View>
        </AuthenticateLayout>
    );
}