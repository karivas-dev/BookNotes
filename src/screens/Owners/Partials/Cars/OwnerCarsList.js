import { View,Text,FlatList,TouchableOpacity,ActivityIndicator, Pressable } from "react-native"
import { useState, useEffect, useCallback } from "react";

import { Card } from '../../../../components/Card';
import { TxtInput } from "../../../../components/TxtInput";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { SecondaryButton } from "../../../../components/SecondaryButton";
import { Messages } from "../../../../components/Messages";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { user } from "../../../../context/UserAttributesContext";


export const OwnerCarsList = ({navigation,owner_id,cars}) => {

    const [filterCars,setFilterCars] = useState(cars);
    const [search, setSearch] = useState('');

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = cars.filter((car) => {
                const lowerPlates = car.plates.toLowerCase();
                const lowerSerial = car.serial_number.toLowerCase();
                return (
                    lowerPlates.includes(textSearch.trim()) ||
                    lowerSerial.includes(textSearch.trim())
                );
            });
            setFilterCars(filteredData);
        }else{
            setFilterCars(cars);
        }
    }

    const renderItem = useCallback(({item:car}) => {
        return (
           <Card>
                <View className="flex flex-1 flex-col justify-center items-center" >
                    <View className="grow">
                        <View className="p-4" >
                            <Pressable onPress={() => (navigation.navigate('DetailCar',{ id: car.id }), setSearch(''))}>
                                <Text className="text-gray-200 text-md font-bold text-center underline">{ car.plates }</Text>
                            </Pressable>
                            <Pressable onPress={() => (navigation.navigate('DetailCar',{ id: car.id }), setSearch(''))}>
                                <Text className="text-gray-200 text-md font-bold text-center underline">{ car.serial_number }</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
           </Card>
        );
    },[])

    return (
        <View className="flex-1 items-center justify-center">
            <View className="w-full max-w-sm">
                <View className="flex flex-row justify-between">
                    <Text className="font-bold mb-6 text-gray-200 mt-5 text-2xl">Cars</Text>
                    {
                        user.type == 'Insurer' ? (
                            <View className="justify-end mt-5 mb-6">
                                <SecondaryButton onPress={() => (navigation.navigate('CreateEditCar',{ 
                                    id: '',
                                    plates: '',
                                    serial_number: '',
                                    owner_id: owner_id,
                                    brand_id: '',
                                    model_id: '',
                                }), setSearch(''))} message="+ Car"/>
                            </View>
                        ):null
                    }
                </View>
                {
                    cars.length != 0 ? (
                        <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)}/>
                    ):null
                }
            </View>
            <View className="flex-1 w-full max-w-sm">
                {
                    cars.length != 0  ? (
                        <FlatList horizontal
                            data={search.length == 0 ? cars : filterCars}
                            renderItem={renderItem}
                            keyExtractor={(item) => `${item.id}`}
                            ItemSeparatorComponent={() => {return (<View className="ml-4"/>);}}
                            style={{flex: 1}}
                        /> 
                    ) : (
                        <Messages message={'No data of Cars in our records ...'} level={'info'}/>
                    )
                }
            </View>
        </View>
    ); 
}