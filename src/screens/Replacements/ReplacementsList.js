import {View,Text,FlatList,ActivityIndicator,Pressable} from "react-native";
import { AuthenticateLayout } from "../../layouts/AuthenticateLayout";
import { useState, useEffect, useCallback } from "react";
import { Header } from "../../components/Header";
import { Entypo } from "@expo/vector-icons";
import { Card } from "../../components/Card";
import { TxtInput } from "../../components/TxtInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { getReplacements } from "../../hooks/ReplacementApi";
import { user } from "../../context/UserAttributesContext";

export const ReplacementsList = ({navigation, route}) => {
    const { level, flashMessage, page } = route.params;

    const { data, isLoading, isError, isFetching, error, replacements } =
      getReplacements(page);
  
    const [filterReplacements, setFilterReplacements] = useState(replacements);
    const [search, setSearch] = useState("");
  
    const shortDescripton = (description) => {
        return description.substring(0, 20) + "...";
    };

    const handleSearch = (text) => {
        setSearch(text.toLowerCase());
        const textSearch = text.toLowerCase();
        if (text.trim().length !== 0) {
            let filteredData = replacements.filter((replacement) => {
                const lowername = replacement.name.toLowerCase();
                const lowerDescription = replacement.description.toLowerCase();
                return (
                    lowername.includes(textSearch.trim()) ||
                    lowerDescription.includes(textSearch.trim())
                );
            });
            setFilterReplacements(filteredData);
        } else {
            setFilterReplacements(replacements);
        }
    };
  
    const renderItem = useCallback(({ item: replacement }) => {
        return (
            <Card>
                <View className="flex flex-row">
                    <View className="py-4">
                        <Entypo name="tools" size={30} color="white" />
                    </View>
                    <View className="grow mt-4">
                        <View className="ml-8">
                            <Text className="text-gray-200 text-md font-bold ">
                                {replacement.name}
                            </Text>
                            <Text className="text-gray-200 text-md ">
                                {shortDescripton(replacement.description)}
                            </Text>
                        </View>
                    </View>
                    <View className="py-4">
                        <Pressable onPress={() => (
                            navigation.navigate("DetailReplacement", {
                                id: replacement.id,
                            }),
                            setSearch("")
                            )}
                        >
                            <MaterialIcons name="arrow-forward-ios" size={30} color="white" />
                        </Pressable>
                    </View>
                </View>
            </Card>
        );
    }, []);
  
    const ListFooterComponent = () => {
        if (data?.links?.next != null) {
            return (
                <View className="mt-2">
                    <PrimaryButton message={"load more"} onPress={() => navigation.setParams({ page: page + 1 })} />
                </View>
            );
        }
    };
  

    return (
        <AuthenticateLayout level={level} flashMessage={flashMessage}>
            <Header navigation={navigation} />
            <View className="flex-1 items-center justify-center">
                <View className="w-full max-w-sm">
                    <View className="flex flex-row justify-between">
                        <Text className="font-bold mb-6 text-gray-200 mt-5 text-2xl">Replacements</Text>
                        {
                            user.isAdmin && user.type == "Store" ? (
                                <View className="justify-end mt-5 mb-6">
                                    <PrimaryButton
                                        onPress={() => (
                                            navigation.navigate("EditCreateReplacement", {
                                                id: '',
                                                name: '',
                                                description: '',
                                                brand_id: '',
                                                model_id: '',
                                            }),
                                            setSearch("")
                                        )}
                                        message="+ new"
                                    />
                                </View>
                            ):null
                        }
                    </View>
                    {isLoading || isFetching ? null : isError ? (
                        <MaterialIcons name="error-outline" size={24} color="white" />
                    ) : (
                        <TxtInput placeholder={"Search"} value={search} onChangeText={(text) => handleSearch(text)}/>
                    )}
                </View>
                <View className="flex-1 w-full max-w-sm">
                    {isLoading || isFetching ? (
                            <ActivityIndicator size="large" style={{ marginVertical: 16 }} color="white" />
                        ) : isError ? (
                            error.response.data?.message ? (
                                <Messages message={`${error.response.data?.message}`} level={"error"} />
                            ) : (
                                <Messages message={`Here was a problem processing Replacements : ${error.message}`} level={"error"} />
                            )
                        ) : replacements.length != 0 ? (
                                <FlatList
                                    data={search.length == 0 ? replacements : filterReplacements}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => `${item.id}`}
                                    ListFooterComponent={ListFooterComponent}
                                    style={{ flex: 1 }}
                                />
                        ) : (
                            <Messages message={"No data of Replacements in our records ..."} level={"info"} />
                        )
                    }
                </View>
            </View>
        </AuthenticateLayout>
    );
}