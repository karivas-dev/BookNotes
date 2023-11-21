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

export const TicketBidList = ({navigation,bids,ticket_id }) => {

    const [filterBids,setFilterBids] = useState(bids);
    const [search, setSearch] = useState('');

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = bids.filter((bid) => {
                return (
                    bid.toString().includes(textSearch.trim())
                );
            });
            setFilterBids(filteredData);
        }else{
            setFilterBids(bids);
        }
    }

    const renderItem = useCallback(({item: bid}) => {
        return (
           <Card>
                <View className="flex flex-1 flex-col justify-center items-center" >
                    <View className="grow">
                        <View className="p-4" >
                            <View className="mb-2">
                                {
                                    user.type == 'Insurer' || user.type == 'Garage' ? (
                                        <Pressable onPress={() => (navigation.navigate('DetailTicketBid',{ id: bid ,ticket_id:ticket_id }), setSearch(''))}>
                                            <Text className="text-gray-200 text-md font-bold text-center underline">{"ID: " + bid}</Text>
                                        </Pressable>
                                    ):<Text className="text-gray-200 text-md font-bold text-center underline">{"ID: " + bid}</Text>
                                }
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
                    <Text className="font-bold mb-6 text-gray-200 mt-5 text-2xl">Bids</Text>
                    <View className="justify-end mt-5 mb-6">
                        {
                            user.type == 'Garage'  ? (
                                <SecondaryButton onPress={() => (navigation.navigate('CreateEditTicketBid',{ 
                                    id: '',
                                    ticket_id: ticket_id,
                                    bid_status_id: '',
                                    timespan: '',
                                    details: [{ id: '', name: '', price: 0 }],
                                }), setSearch(''))} message="+ Bid"/>
                            ):null
                        }
                    </View>
                </View>
                {
                    bids.length != 0 ? (
                        <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)}/>
                    ):null
                }
            </View>
            <View className="flex-1 w-full max-w-sm">
                {
                    bids.length != 0  ? (
                        <FlatList horizontal
                            data={search.length == 0 ?  bids : filterBids}
                            renderItem={renderItem}
                            keyExtractor={(item) => `${item}`}
                            ItemSeparatorComponent={() => {return (<View className="ml-4"/>);}}
                            style={{flex: 1}}
                        /> 
                    ) : (
                        <Messages message={'No data of Bids of this Ticket in our records ...'} level={'info'}/>
                    )
                }
            </View>
        </View>
    )
}