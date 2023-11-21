import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

import {Header} from '../../components/Header';

import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';

import { PrimaryButton } from '../../components/PrimaryButton';
import { createEditModel } from '../../hooks/ModelApi';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {FormikInput} from "../../components/FormikInput";


export const CreateEditModel = ({navigation, route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            name: route.params.name ?? '',
            brand_id: route.params.brand_id
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(),
            brand_id: Yup.number().required()
        }),
        onSubmit: async (model) => await createEditAttempt.mutateAsync(model),
    });
    const createEditAttempt = createEditModel(formik.setErrors, formik.values);

    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Model' : 'Update Model' }
                    </Text>

                    <FormikInput valueName="name" formik={formik} placeholder="Model name:" label={formik.values.id == '' ? null : 'Name: '}/>

                    <View className="block w-full mt-2">
                    { formik.isSubmitting ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <PrimaryButton onPress={formik.handleSubmit}  message={formik.values.id == '' ? 'Store Model' : 'Edit Model'}/>
                    )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}