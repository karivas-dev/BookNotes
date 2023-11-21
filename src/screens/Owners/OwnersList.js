import { View,Text,FlatList,TouchableOpacity,ActivityIndicator } from "react-native"
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { useState, useEffect, useCallback } from "react";

import { Card } from '../../components/Card';
import { TxtInput } from "../../components/TxtInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getOwners } from "../../hooks/OwnerApi";
import { Pressable } from "react-native";
import { user } from "../../context/UserAttributesContext";

export const OwnersList = ({navigation, route}) => {

    //flash message
    const {level, flashMessage, page} = route.params;

    const [filterOwners,setFilterOwners] = useState(owners);
    const [search, setSearch] = useState('');

    const {data, isLoading, isError, isFetching, error, owners} = getOwners(page);

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = owners.filter((owner) => {
                const lowerFirstName = owner.firstname.toLowerCase();
                const lowerLastName = owner.lastname.toLowerCase();
                const lowerEmail = owner.email.toLowerCase();
                const lowerPhone = owner.telephone.toLowerCase();
                return (
                    lowerFirstName.includes(textSearch.trim()) ||
                    lowerLastName.includes(textSearch.trim()) ||
                    lowerEmail.includes(textSearch.trim()) ||
                    lowerPhone.includes(textSearch.trim())
                );
            });
            setFilterOwners(filteredData);
        }else{
            setFilterOwners(owners);
        }
    }
    const keyExtractorOwner = useCallback((item) => `${item.id}`);

    const renderItem = useCallback(({item: owner}) => {
        return (
            <Card>
                <View className="flex flex-row py-2" >
                    <View className="py-2">
                        <Ionicons name="person" size={30} color="white" />
                    </View>
                    <View className="grow">
                        <View className="ml-4" >
                            <Text className="text-gray-200 text-md font-bold ">{ owner.firstname } , { owner.lastname }</Text>
                            <Text className="text-gray-200 text-md ">{ owner.email }</Text>
                            <Text className="text-gray-200 text-md ">{ owner.telephone }</Text>
                        </View>
                    </View>
                    {
                        user.type == 'Insurer' ? (
                            <View className="py-2">
                                <Pressable onPress={() => (navigation.navigate('DetailOwner',{ id: owner.id }), setSearch(''))}>
                                    <MaterialIcons name="arrow-forward-ios" size={30} color="white" />
                                </Pressable>
                            </View>
                        ):null
                    }
                </View>
            </Card>
        )
    },[])

    const ListFooterComponentOwners= () => {
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
                        <Text className="font-bold mb-6 text-gray-200 mt-5 text-3xl">Owners</Text>
                        {
                            user.type == 'Insurer' ? (
                                <View className="justify-end mt-5 mb-6">
                                    <PrimaryButton onPress={() => (navigation.navigate('CreateEditOwner',{ 
                                        ownerParms  : {
                                            id: '',
                                            firstname:'',
                                            lastname: '',
                                            email: '',
                                            telephone: '',
                                            district_id: ''
                                        }}), setSearch(''))} message="+ Owner"/>
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
                            error.response.data?.message ? (
                                <Messages message={`${error.response.data?.message}`} level={"error"} />
                            ) : (
                                <Messages message={`Here was a problem processing Owners : ${error.message}`} level={"error"} />
                            )
                           
                        ) : owners ? (
                            <FlatList
                                data={search.length == 0 ? owners : filterOwners}
                                renderItem={renderItem}
                                keyExtractor={keyExtractorOwner}
                                ListFooterComponent={ListFooterComponentOwners}
                                style={{flex: 1}}
                            /> 
                        ) : (
                            <Messages message={'No data of Owners in our records ...'} level={'info'}/>
                        )
                    }
                </View>
            </View>
        </AuthenticateLayout>
    ); 
}