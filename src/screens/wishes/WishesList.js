import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { AuthenticateLayout } from "../../layouts/AuthenticateLayout";
import { useState, useCallback } from "react";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Messages } from "../../components/Messages";
import { Header } from "../../components/Header";
import { getWishes } from "../../hooks/WishApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export const WishesList = ({ navigation, route }) => {
  const { level, flashMessage } = route.params;
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, error, wishes } =
    getWishes(page);

  const renderItem = useCallback(({ item: wish }) => {
    return (
      <>
        {wish.isOwned == false ? (
          <Card>
            <View className="flex flex-row py-2">
              <View className="grow">
                <Text className="text-gray-900 text-md font-bold ">
                  {wish.title}
                </Text>
                <Text className="text-gray-900 text-md">
                  By {wish.author.name}
                </Text>
              </View>
            </View>
          </Card>
        ) : null}
      </>
    );
  }, []);

  const ListFooterComponentWishes = () => {
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
                Libros deseados
              </Text>
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
          ) : wishes ? (
            <FlatList
              data={wishes}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListFooterComponent={ListFooterComponentWishes}
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
