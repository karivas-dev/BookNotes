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
import { getBranches } from "../../hooks/BranchApi";

export const BranchesList = ({navigation, route}) => {

    //flash message
    const {level, flashMessage, page} = route.params;
    
    const {data, isLoading, isError, isFetching, error, branches} = getBranches(page);
    const [filterBranches,setFilterBranches] = useState(branches);
    const [search, setSearch] = useState('');

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if(text.trim().length !== 0 ){
            let filteredData = branches.filter((branch) => {
                const lowerEmail = branch.email.toLowerCase();
                const lowerTelephone = branch.telephone.toLowerCase();
                return (
                    lowerEmail.includes(textSearch.trim()) ||
                    lowerTelephone.includes(textSearch.trim())
                );
            });
            setFilterBranches(filteredData);
        }else{
            setFilterBranches(branches);
        }
    }

    const renderItem = useCallback(({item: branch}) => {
        return (
            <Card>
                <View className="flex flex-row py-2" >
                    <View className="py-2">
                        <MaterialCommunityIcons name="store-cog" size={30} color="white" />
                    </View>
                    <View className="grow">
                        <View className="ml-4 py-2" >
                            <Text className="text-gray-200 text-md font-bold ">{branch.email}</Text>
                            <Text className="text-gray-200 text-md font-bold ">{branch.telephone}</Text>
                        </View>
                    </View>
                    
                    <View className="py-2">
                        <Pressable onPress={() => (navigation.navigate('BranchDetail',{ id: branch.id }), setSearch(''))}>
                            <MaterialIcons name="arrow-forward-ios" size={30} color="white" />
                        </Pressable>
                    </View>
                </View>
            </Card>
        )
    },[])

    const ListFooterComponent= () => {
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
            <View className="flex-1 items-center justify-center">
                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-200 mt-5 text-3xl">Branches</Text>
                    </View>
                    {
                        isLoading || isFetching? (
                            null
                        ) : isError ? (
                            <MaterialIcons name="error-outline" size={24} color="white" />
                        ):(
                            branches.length != 0 ? (
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
                            <Messages message={`Here was a problem processing Branches : ${error.message}`} level={'error'}/>
                           
                        ) : branches.length != 0  ? (
                            <FlatList
                                data={search.length == 0 ? branches : filterBranches}
                                renderItem={renderItem}
                                keyExtractor={(item) => `${item.id}`}
                                ListFooterComponent={ListFooterComponent}
                                style={{flex: 1}}
                            /> 
                        ) : (
                            <Messages message={'No data of Branches in our records ...'} level={'info'}/>
                        )
                    }
                </View>
            </View>
        </AuthenticateLayout>
    ); 


}