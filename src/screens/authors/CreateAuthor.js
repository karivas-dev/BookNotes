import React from 'react';
import {Header} from '../../components/Header';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { PrimaryButton } from '../../components/PrimaryButton';
import { createAuthor } from '../../hooks/AuthorApi';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {FormikInput} from "../../components/FormikInput";

export const CreateAuthor = ({navigation , route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            name: route.params.name ?? '',
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required()
        }),
        onSubmit: async (author) => await createEditAttempt.mutateAsync(author)
    });

    const createEditAttempt = createAuthor(formik.setErrors, formik.values);

    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>
            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-xl font-extrabold text-gray-800 mb-5 text-center">
                        Añadir nuevo autor
                    </Text>

                    <FormikInput valueName="name" formik={formik} placeholder="Nombre" label={''}/>
                    <FormikInput valueName="country" formik={formik} placeholder="País" label={''}/>
                    <FormikInput valueName="description" formik={formik} placeholder="Descripción breve" label={''}/>

                    <View className="block w-full mt-2">
                    { formik.isSubmitting ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <PrimaryButton onPress={formik.handleSubmit}  message={'Guardar'}/>
                    )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}