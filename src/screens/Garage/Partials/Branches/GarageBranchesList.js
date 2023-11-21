import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Pressable } from "react-native"
import { useState, useEffect, useCallback } from "react";

import { Card } from '../../../../components/Card';
import { TxtInput } from "../../../../components/TxtInput";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { SecondaryButton } from "../../../../components/SecondaryButton";
import { Messages } from "../../../../components/Messages";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getBranches } from "../../../../hooks/BranchApi";
import { user } from "../../../../context/UserAttributesContext";

const showMain = (main) => {
    if (main) {
        return "main"
    }
    else {
        return "regular"
    }
};

export const GarageBranchesList = ({ navigation, branches, garage_id }) => {

    const [filterBranches, setFilterBranches] = useState(branches);
    const [search, setSearch] = useState('');
    
    

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if (text.trim().length !== 0) {
            let filteredData = branches.filter((branch) => {
                const lowerEmail = branch.email.toLowerCase();
                const lowerTelephone = branch.telephone.toLowerCase();
                const mainOrRegular = showMain(branch.main).toLowerCase();
                return (
                    lowerEmail.includes(textSearch.trim()) ||
                    lowerTelephone.includes(textSearch.trim()) ||
                    mainOrRegular.includes(textSearch.trim())
                );
            });
            setFilterBranches(filteredData);
        } else {
            setFilterBranches(branches);
        }
    }
    
    const renderItem = useCallback(({item: branch}) => {
        return (
           <Card>
                <View className="flex flex-1 flex-col justify-center items-center" >
                    <View className="grow">
                        <View className="p-4" >
                            <View className="mb-2">
                                <Pressable onPress={() => (navigation.navigate('DetailGarageBranch',{ id: branch.id }), setSearch(''))}>
                                    <Text className="text-gray-200 text-md font-bold text-center underline">{ branch.email }</Text>
                                </Pressable>
                            </View>
                            <View className="mb-2">
                                <Pressable onPress={() => (navigation.navigate('DetailGarageBranch',{ id: branch.id }), setSearch(''))}>
                                    <Text className="text-gray-200 text-md font-bold text-center underline">{ branch.telephone }</Text>
                                </Pressable>
                            </View>
                            <Pressable onPress={() => (navigation.navigate('DetailGarageBranch',{ id: branch.id }), setSearch(''))}>
                                <Text className="text-gray-200 text-md font-bold text-center underline">{ showMain(branch.main) }</Text>
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
                    <Text className="font-bold mb-6 text-gray-200 mt-5 text-2xl">Branches</Text>
                    {
                        user.isAdmin ? (
                            <View className="justify-end mt-5 mb-6">
                                <SecondaryButton onPress={() => (navigation.navigate('CreateEditGarageBranch', {
                                    id: '',
                                    email: '',
                                    telephone: '',
                                    main: '',
                                    district_id: '',
                                    branchable_id: garage_id,
                                    branchable_type: 'Garage',
                                }), setSearch(''))} message="+ Branch" />
                            </View>
                        ):null
                    }
                </View>
                {
                    branches.length != 0 ? (
                        <TxtInput placeholder={'Search'} value={search} onChangeText={(text) => handleSearch(text)} />
                    ) : null
                }
            </View>
            <View className="flex-1 w-full max-w-sm">
                {
                    branches.length != 0 ? (
                        <FlatList horizontal
                            data={search.length == 0 ? branches : filterBranches}
                            renderItem={renderItem}
                            keyExtractor={(item) => `${item.id}`}
                            ItemSeparatorComponent={() => { return (<View className="ml-4" />); }}
                            style={{ flex: 1 }}
                        />
                    ) : (
                        <Messages message={'No data of Branches of this Store in our records ...'} level={'info'} />
                    )
                }
            </View>
        </View>
    )
}