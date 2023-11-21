import { View,Text,FlatList,TouchableOpacity,ActivityIndicator, Pressable } from "react-native"
import { useState, useEffect, useCallback } from "react";

import { Card } from '../../../../components/Card';
import { TxtInput } from "../../../../components/TxtInput";
import { Messages } from "../../../../components/Messages";

export const BidDetailList = ({details}) => {

    const [filterDetails,setFilterDetails] = useState(details);
    const [search, setSearch] = useState('');

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = details.filter((detail) => {
                const lowerName = detail.name.toLowerCase();
                const lowerPrice = detail.price.toLowerCase();
                return (
                    lowerName.includes(textSearch.trim()) ||
                    lowerPrice.includes(textSearch.trim())
                );
            });
            setFilterDetails(filteredData);
        }else{
            setFilterDetails(details);
        }
    }

    const renderItem = useCallback(({item: detail}) => {
        return (
           <Card>
                <View className="flex flex-1 flex-col justify-center items-center" >
                    <View className="grow">
                        <View className="p-4" >
                            <View className="mb-2">
                                <Text className="text-gray-200 text-lg text-center" > 
                                    <Text className="text-gray-200 text-lg font-bold" >Name: </Text> {detail.name}
                                </Text><Text>{`\n`}</Text>
                                <Text className="text-gray-200 text-lg text-center" > 
                                    <Text className="text-gray-200 text-lg font-bold" >Price: </Text> {detail.price}
                                </Text><Text>{`\n`}</Text>
                            </View>
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
                    <Text className="font-bold mb-6 text-gray-200 mt-5 text-2xl">Details</Text>
                </View>
                {
                    details.length != 0 ? (
                        <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)}/>
                    ):null
                }
            </View>
            <View className="flex-1 w-full max-w-sm">
                {
                    details.length != 0  ? (
                        <FlatList horizontal
                            data={search.length == 0 ?  details : filterDetails}
                            renderItem={renderItem}
                            keyExtractor={(item) => `${item.id}`}
                            ItemSeparatorComponent={() => {return (<View className="ml-4"/>);}}
                            style={{flex: 1}}
                        /> 
                    ) : (
                        <Messages message={'No data of Details of this Bid in our records ...'} level={'info'}/>
                    )
                }
            </View>
        </View>
    )
}