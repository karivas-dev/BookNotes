import { View,Text,FlatList,TouchableOpacity,ActivityIndicator, Pressable } from "react-native"
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { useState, useEffect, useCallback } from "react";

import { Card } from '../../components/Card';
import { TxtInput } from "../../components/TxtInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SecondaryButton } from "../../components/SecondaryButton";
import { Messages } from "../../components/Messages";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getModelsByBrand } from "../../hooks/ModelApi";
import { user } from "../../context/UserAttributesContext";

export const ModelList = ({navigation, route}) => {

    const {page} = route.params;

    const [filterModels,setFilterModels] = useState(models);
    const [search, setSearch] = useState('');

    const {data, isLoading, isError, isFetching, error, models} = getModelsByBrand(page, route.params.id);
    
    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = models.filter((model) => {
                const lowerName = model.name.toLowerCase();
                return (
                    lowerName.includes(textSearch.trim())
                );
            });
            setFilterModels(filteredData);
        }else{
            setFilterModels(models);
        }
    }

    const keyExtractorModel = useCallback((item) => `${item.id}`);

    const renderItem = useCallback(({item: model}) => {
        return (
           <Card>
                <View className="flex flex-1 flex-col justify-center items-center" >
                    <View className="grow">
                        <View className="p-4" >
                            <Pressable onPress={() => (navigation.navigate('DetailModel',{ id: model.id , brandId: route.params.id }), setSearch(''))}>
                                <Text className="text-gray-200 text-md font-bold text-center underline">{ model.name }</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
           </Card>
        );
    },[])

    const ListFooterComponentModels= () => {
        if(data?.links?.next != null){
            return (
                <View className=" ml-2 p-4">
                    <Card>
                        <PrimaryButton message={'load more'} onPress={ () => navigation.setParams({ page: page + 1}) }></PrimaryButton>
                    </Card>
                </View>
            );
        }
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View className="w-full max-w-sm">
                <View className="flex flex-row justify-between">
                    <Text className="font-bold mb-6 text-gray-200 mt-5 text-2xl">Models</Text>
                    {
                        user.type != 'Garage' ? (
                            <View className="justify-end mt-5 mb-6">
                                <SecondaryButton onPress={() => (navigation.navigate('CreateEditModel',{ 
                                    brand_id: route.params.id,
                                }), setSearch(''))} message="+ Model"/>
                            </View>
                        ):null
                    }
                </View>
                {
                    isLoading || isFetching ? (
                        null
                    ) : isError ? (
                        <MaterialIcons name="error-outline" size={24} color="white" />
                    ):(
                        models.length != 0 ? (
                            <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)}/>
                        ):null
                    )
                }
            </View>
            <View className="flex-1 w-full max-w-sm">
                {
                    isLoading || isFetching ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ): isError ? (
                        error.response.data?.message ? (
                            <Messages message={`${error.response.data?.message}`} level={'error'}/>
                        ) 
                        : (<Messages message={`Here was a problem processing Models : ${error.message}`} level={'error'}/>)
                        
                    ) : models.length != 0  ? (
                        <FlatList horizontal
                            data={search.length == 0 ? models : filterModels}
                            renderItem={renderItem}
                            keyExtractor={keyExtractorModel}
                            ListFooterComponent={ListFooterComponentModels}
                            ItemSeparatorComponent={() => {return (<View className="ml-4"/>);}}
                            style={{flex: 1}}
                        /> 
                    ) : (
                        <Messages message={'No data of Models in our records ...'} level={'info'}/>
                    )
                }
            </View>
        </View>
    ); 
}