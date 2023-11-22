import {
  View,
  Text,
  FlatList,
  ActivityIndicator
} from "react-native";
import { AuthenticateLayout } from "../../layouts/AuthenticateLayout";
import { useState, useCallback } from "react";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { Header } from "../../components/Header";
import { getCategories } from "../../hooks/CategoryApi";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const CategoriesList = ({ navigation, route }) => {
  const { level, flashMessage } = route.params;
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, error, categories } =
    getCategories(page);

  const renderItem = useCallback(({ item: category }) => {
    return (
      <Card>
        <View className="flex flex-row py-2">
          <View className="grow">
            <Text className="text-gray-900 text-md font-bold ">
                {category.name}
            </Text>
          </View>
          <View className="">
              <Pressable onPress={() => (navigation.navigate('DetailBook', { id:book.id }))}>
                    <MaterialIcons name="arrow-forward-ios" 
                   size={24} color="gray" />
              </Pressable>
            </View>
        </View>
      </Card>
    );
  }, []);

  const ListFooterComponentCategories = () => {
    if (data?.links?.next != null) {
      return (
        <View className="mt-2">
          <PrimaryButton
            message={"Mostrar más"}
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
                Categorias
              </Text>
            </View>

            <View className="justify-end mt-5 mb-6">
              <PrimaryButton
                onPress={() => (navigation.navigate("CreateCategory", { id: "", name: "" }))}
                message="Añadir"
              />
            </View>
          </View>
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
              message={`Ups! Hubo un error : ${error.message}`}
              level={"error"}
            />
          ) : categories ? (
            <FlatList
              data={ categories }
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListFooterComponent={ListFooterComponentCategories}
              style={{ flex: 1 }}
            />
          ) : (
            <Messages
              message={"No hay categorías que mostrar."}
              level={"info"}
            />
          )}
        </View>
      </View>
    </AuthenticateLayout>
  );
};
