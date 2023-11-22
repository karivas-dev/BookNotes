import React from "react";
import * as Yup from "yup";
import { Header } from "../../components/Header";
import { View, Text, ActivityIndicator } from "react-native";
import { AuthenticateLayout } from "../../layouts/AuthenticateLayout";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useFormik } from "formik";
import { FormikInput } from "../../components/FormikInput";
import { SelectInput } from "../../components/SelectInput";
import { getCategories } from "../../hooks/CategoryApi";
import { getAuthors } from "../../hooks/AuthorApi";
import { createEditBook } from "../../hooks/BookApi";

export const CreateLibrary = ({ navigation, route }) => {
  const formik = useFormik({
    initialValues: {
      id: route.params.id ?? "",
      name: route.params.name ?? "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
    }),
    onSubmit: async (library) => await createEditAttempt.mutateAsync(library),
  });

  const createEditAttempt = createEditBook(formik.setErrors, formik.values);
  const { authors } = getAuthors(1);
  const { categories } = getCategories(1);

  return (
    <AuthenticateLayout>
      <Header navigation={navigation} />
      <View className="flex-1 items-center justify-center p-8">
        <View className="w-full p-8 max-w-sm">
          <Text className="text-xl font-extrabold text-gray-800 mb-5 text-center">
            {formik.values.id == "" ? "Añadir libro" : "Editar libro"}
          </Text>

          <FormikInput
            valueName="title"
            formik={formik}
            placeholder="Título"
            label={formik.values.id == "" ? null : "Título: "}
          />
          <FormikInput
            valueName="description"
            formik={formik}
            placeholder="Descripción breve"
            label={formik.values.id == "" ? null : "Descripción: "}
          />

          {authors == null ? null : (
            <>
              <SelectInput
                selectedValue={formik.values.author_id}
                onValueChange={formik.handleChange("author_id")}
                DefaultPlaceholder="Selecciona el autor"
                data={authors}
              />
              <Text className="text-red-500">
                {formik.touched?.author_id && formik.errors?.author_id}
              </Text>
            </>
          )}

          {categories == null ? null : (
            <>
              <SelectInput
                selectedValue={formik.values.category_id}
                onValueChange={formik.handleChange("category_id")}
                DefaultPlaceholder="Selecciona el autor"
                data={categories}
              />
              <Text className="text-red-500">
                {formik.touched?.category_id && formik.errors?.category_id}
              </Text>
            </>
          )}

          <SelectInput
            selectedValue={formik.values.category_id}
            onValueChange={formik.handleChange("category_id")}
            DefaultPlaceholder="Selecciona el autor"
            data={categories}
          />
          
          <Text className="text-red-500">
            {formik.touched?.category_id && formik.errors?.category_id}
          </Text>

          <View className="block w-full mt-3">
            {formik.isSubmitting ? (
              <ActivityIndicator
                size="large"
                style={{ marginVertical: 16 }}
                color="white"
              />
            ) : (
              <PrimaryButton
                onPress={formik.handleSubmit}
                message={"Guardar"}
              />
            )}
          </View>
        </View>
      </View>
    </AuthenticateLayout>
  );
};
