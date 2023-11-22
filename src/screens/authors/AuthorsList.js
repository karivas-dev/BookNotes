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
import { getAuthors } from "../../hooks/AuthorApi";

export const AuthorsList = ({ navigation, route }) => {
  const { level, flashMessage } = route.params;
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, error, authors } =
    getAuthors(page);

  const renderItem = useCallback(({ item: author }) => {
    return (
      <Card>
        <View className="flex flex-row py-2">
          <View className="grow">
            <Text className="text-gray-900 text-md font-bold ">
                {author.name}
            </Text>
            <Text className="text-gray-900 text-md">
                {author.country}
            </Text>
            <Text className="text-gray-900 text-md ">
                {author.description}
            </Text>
          </View>
        </View>
      </Card>
    );
  }, []);

  const ListFooterComponentAuthors = () => {
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
                Autores
              </Text>
            </View>

            <View className="justify-end mt-5 mb-6">
              <PrimaryButton
                onPress={() => (navigation.navigate("CreateAuthor", { id: "", name: "" }))}
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
          ) : authors ? (
            <FlatList
              data={ authors }
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListFooterComponent={ListFooterComponentAuthors}
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
