import React from 'react';
import {Header} from '../../components/Header';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { PrimaryButton } from '../../components/PrimaryButton';
import { createCategory } from '../../hooks/CategoryApi';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {FormikInput} from "../../components/FormikInput";

export const CreateCategory = ({navigation , route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            name: route.params.name ?? '',
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required()
        }),
        onSubmit: async (category) => await createEditAttempt.mutateAsync(category)
    });

    const createEditAttempt = createCategory(formik.setErrors, formik.values);

    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>
            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-xl font-extrabold text-gray-800 mb-5 text-center">
                        Añadir nueva categoría
                    </Text>

                    <FormikInput valueName="name" formik={formik} placeholder="Nombre" label={''}/>

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