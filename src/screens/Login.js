import { ActivityIndicator, Image, Text, View } from "react-native";
import { GuestLayout } from "../layouts/GuestLayout";
import { PrimaryButton } from "../components/PrimaryButton";
import { userLoginAttempt } from "../hooks/AuthApi";
import { useFormik } from "formik";
import * as WebBrowser from "expo-web-browser";
import * as Yup from "yup";
import { FormikInput } from "../components/FormikInput";
import { useEffect } from "react";
import BookCat from "../../assets/bookcat.png";
import { useNavigation } from "@react-navigation/native";
import { getAuthToken } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

export const Login = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Si existe un token de sesión, navega al flujo principal
        const token = await getAuthToken();
        if (token) navigation.navigate("Home", { screen: "HomePage" });
      } catch (error) {
        console.error(
          "Error al verificar el estado de inicio de sesión: ",
          error
        );
      }
    };
    checkLoginStatus();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    }),
    onSubmit: async (user) => await loginAttempt.mutateAsync(user),
  });
  const loginAttempt = userLoginAttempt(formik.setErrors);

  return (
    <GuestLayout>
      <View className="items-center justify-center mb-2">
        <Image className="w-48 h-48 rounded-full" source={BookCat} />
      </View>

      <Text className="text-5xl font-bold mb-6 text-center text-gray-800">
        Book Notes
      </Text>

      <View className="my-5">
        <FormikInput
          valueName="email"
          formik={formik}
          placeholder="Correo electrónico"
        />
        <FormikInput
          valueName="password"
          formik={formik}
          placeholder="Contraseña"
          passEntry={true}
        />
      </View>

      <View className="flex flex-row justify-end">
        <PrimaryButton onPress={formik.handleSubmit} message="Iniciar sesión" />
      </View>

      {formik.isSubmitting ? (
        <ActivityIndicator
          size="large"
          style={{ marginVertical: 16 }}
          color="white"
        />
      ) : null}
    </GuestLayout>
  );
};
