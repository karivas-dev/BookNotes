import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import { AuthenticateLayout } from "../../layouts/AuthenticateLayout";
import { useState, useCallback } from "react";
import { Card } from "../../components/Card";
import { TxtInput } from "../../components/TxtInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { Header } from "../../components/Header";
import { MaterialIcons } from "@expo/vector-icons";
import { getBook } from "../../hooks/BookApi";

export const BooksList = ({ navigation, route }) => {
  const { level, flashMessage } = route.params;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, isFetching, error, brands } = getBook(page);

  const renderItem = useCallback(({ item: book }) => {
    return (
      <Card>
        <View className="flex flex-row py-2">
          <View className="grow">
            <View className="ml-4">
              <Text className="text-gray-800 text-md font-bold ">
                {book.title}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  }, []);

  const ListFooterComponentBrands = () => {
    if (data?.links?.next != null) {
      return (
        <View className="mt-2">
          <PrimaryButton
            message={"Cargar más"}
            onPress={() => setPage(page + 1)}
          ></PrimaryButton>
        </View>
      );
    }
  };

  return (
    <AuthenticateLayout level={level} flashMessage={flashMessage}>
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-sm">
          <View className="flex flex-row justify-between">
            <View className="flex flex-row">
              <Header navigation={navigation} />
              <Text className="font-bold ml-2 mb-6 text-gray-800 mt-5 text-3xl">
                Mis libros
              </Text>
            </View>
            <View className="justify-end mt-5 mb-6">
              <PrimaryButton
                onPress={() => (
                  navigation.navigate("CreateBook", { id: "", name: "" }),
                  setSearch("")
                )}
                message="+ Brand"
              />
            </View>
          </View>
          {isLoading || isFetching ? null : isError ? (
            <MaterialIcons name="error-outline" size={24} color="white" />
          ) : (
            <TxtInput
              placeholder={"Search"}
              value={search}
              onChangeText={(text) => handleSearch(text)}
            />
          )}
        </View>

        <View className="flex-1 w-full max-w-sm">
          {isLoading || isFetching ? (
            <ActivityIndicator
              size="large"
              style={{ marginVertical: 16 }}
              color="white"
            />
          ) : isError ? (
            <Messages
              message={`Here was a problem processing Brands : ${error.message}`}
              level={"error"}
            />
          ) : brands ? (
            <FlatList
              data={search.length == 0 ? brands : filterBrands}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListFooterComponent={ListFooterComponentBrands}
              style={{ flex: 1 }}
            />
          ) : (
            <Messages
              message={"No data of Brands in our records ..."}
              level={"info"}
            />
          )}
        </View>
      </View>
    </AuthenticateLayout>
  );
};
