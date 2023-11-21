import { View,Text,FlatList,TouchableOpacity,ActivityIndicator, Pressable } from "react-native"
import { useState, useEffect, useCallback } from "react";

import { Card } from '../../../../../components/Card';
import { TxtInput } from "../../../../../components/TxtInput";
import { Messages } from "../../../../../components/Messages";
import { PrimaryButton } from "../../../../../components/PrimaryButton";
import { SecondaryButton } from "../../../../../components/SecondaryButton";
import { user } from "../../../../../context/UserAttributesContext";
export const BidReplacementsList = ({navigation,bidReplacements,bid_id}) => {

    const [filterBidReplacements,setFilterBidReplacements] = useState(bidReplacements);
    const [search, setSearch] = useState('');

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = bidReplacements.filter((bidReplacement) => {
                const lowerReplacementName = bidReplacement.replacement.name.toLowerCase();
                return (
                    lowerReplacementName.includes(textSearch.trim()) ||
                    bidReplacement.price.toString().includes(textSearch.trim()) ||
                    bidReplacement.quantity.toString().includes(textSearch.trim())
                );
            });
            setFilterBidReplacements(filteredData);
        }else{
            setFilterBidReplacements(bidReplacements);
        }
    }

    const renderItem = useCallback(({item: bidReplacement}) => {
        return (
           <Card>
                <View className="flex flex-1 flex-col justify-center items-center" >
                    <View className="grow">
                        <View className="p-4" >
                            <View className="mb-2">
                                <Text className="text-gray-200 text-lg text-center" > 
                                    <Text className="text-gray-200 text-lg font-bold" >Name: </Text> {bidReplacement.replacement.name} 
                                </Text><Text>{`\n`}</Text>
                                <Text className="text-gray-200 text-lg text-center" > 
                                    <Text className="text-gray-200 text-lg font-bold" >Price: </Text> {bidReplacement.price}
                                </Text><Text>{`\n`}</Text>
                                <Text className="text-gray-200 text-lg text-center" > 
                                    <Text className="text-gray-200 text-lg font-bold" >Quantity: </Text> {bidReplacement.quantity}
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
                    <Text className="font-bold mb-6 text-gray-200 mt-5 text-2xl">Replacement Details</Text>
                    {
                        user.type == 'Garage' ? (
                            <View className="justify-end mt-5 mb-6">
                                <SecondaryButton
                                    onPress={() => ( 
                                        navigation.navigate("CreateEditBidReplacement", {
                                            id: '',
                                            bid_id: bid_id,
                                            replacements : [{ id: null, replacement_id: '', quantity: ''}],
                                        }),
                                        setSearch("")
                                    )}
                                    message="+ ADD"
                                />
                            </View>
                        ):null
                    }
                </View>
                {
                    bidReplacements.length != 0 ? (
                        <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)}/>
                    ):null
                }
            </View>
            <View className="flex-1 w-full max-w-sm">
                {
                    bidReplacements.length != 0  ? (
                        <FlatList horizontal
                            data={search.length == 0 ?  bidReplacements : filterBidReplacements}
                            renderItem={renderItem}
                            keyExtractor={(item) => `${item.id}`}
                            ItemSeparatorComponent={() => {return (<View className="ml-4"/>);}}
                            style={{flex: 1}}
                        /> 
                    ) : (
                        <Messages message={'No data of this Bid Replacements Details in our records ...'} level={'info'}/>
                    )
                }
            </View>
        </View>
    )
}