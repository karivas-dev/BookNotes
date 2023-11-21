import { View,Text,FlatList,ActivityIndicator, Pressable } from "react-native"
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { useState, useEffect, useCallback } from "react";

import { Card } from '../../components/Card';
import { TxtInput } from "../../components/TxtInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getCars } from "../../hooks/CarApi";
import { user } from "../../context/UserAttributesContext";

export const CarsList = ({navigation, route}) => {

    //flash message
    const {level, flashMessage, page} = route.params;

    const {data, isLoading, isError, isFetching, error, cars} = getCars(page);
    
    const [filterCars,setFilterCars] = useState(cars);
    const [search, setSearch] = useState('');

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = cars.filter((car) => {
                const lowerPlates = car.plates.toLowerCase();
                const lowerBrandName = car.model.brand.name.toLowerCase();
                const lowerModelName = car.model.name.toLowerCase();
                const lowerOwnerFirstName = car.owner.firstname.toLowerCase();
                const lowerOwnerLastName = car.owner.lastname.toLowerCase();
                
                return (lowerPlates.includes(textSearch.trim()) ||lowerBrandName.includes(textSearch.trim()) ||lowerModelName.includes(textSearch.trim()) ||lowerOwnerFirstName.includes(textSearch.trim()) ||lowerOwnerLastName.includes(textSearch.trim()));
            });
            setFilterCars(filteredData);
        }else{
            setFilterCars(cars);
        }
    }

    const renderItem = useCallback(({item: car}) => {
        return (
            <Card>
                <View className="flex flex-row py-2" >
                    <View className="py-4">
                        <Ionicons name="ios-car-sport" size={30} color="white" />
                    </View>
                    <View className="grow">
                        <View className="ml-8" >
                            <Text className="text-gray-200 text-md font-bold ">{ car.owner.firstname } , { car.owner.lastname }</Text>
                            <Text className="text-gray-200 text-md ">{ car.plates }</Text>
                            <Text className="text-gray-200 text-md ">{  car.model.brand.name }</Text>
                            <Text className="text-gray-200 text-md ">{  car.model.name }</Text>

                        </View>
                    </View>
                    <View className="py-4">
                        <Pressable onPress={() => (navigation.navigate('DetailCar',{ id: car.id }), setSearch(''))}>
                            <MaterialIcons name="arrow-forward-ios" size={30} color="white" />
                        </Pressable>
                    </View>
                </View>
            </Card>
        )
    },[])

    const ListFooterComponent = () => {
        if(data?.links?.next != null){
            return (
                <View className="mt-2">
                    {/* <PrimaryButton message={'load more'} onPress={ () =>  setPage(page + 1) }></PrimaryButton> */}
                    <PrimaryButton message={'load more'} onPress={ () => navigation.setParams({ page: page + 1}) }></PrimaryButton>
                </View>
            );
        }
    };

    return (
        <AuthenticateLayout level={level} flashMessage={flashMessage}>
            <View className="flex-1 items-center justify-center">
                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-200 mt-5 text-3xl" >Cars</Text>
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
                            error.response.data?.message ? (
                                <Messages message={`${error.response.data?.message}`} level={'error'}/>
                            ) 
                            : (<Messages message={`Here was a problem processing Cars : ${error.message}`} level={'error'}/>)
                           
                        ) : cars.length != 0  ? (
                            <FlatList
                                data={search.length == 0 ? cars : filterCars}
                                renderItem={renderItem}
                                keyExtractor={(item) => `${item.id}`}
                                ListFooterComponent={ListFooterComponent}
                                style={{flex: 1}}
                            /> 
                        ) : (
                            <Messages message={'No data of Cars in our records ...'} level={'info'}/>
                        )
                    }
                </View>
            </View>
        </AuthenticateLayout>
    ); 
}