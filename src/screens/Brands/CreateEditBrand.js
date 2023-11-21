import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

import {Header} from '../../components/Header';

import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { TxtInput } from '../../components/TxtInput';
import { Messages } from '../../components/Messages';

import { PrimaryButton } from '../../components/PrimaryButton';
import { createEditBrand} from '../../hooks/BrandApi';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {FormikInput} from "../../components/FormikInput";

export const CreateEditBrand = ({navigation , route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            name: route.params.name ?? '',
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required()
        }),
        onSubmit: async (brand) => await createEditAttempt.mutateAsync(brand)
    });
    const createEditAttempt = createEditBrand(formik.setErrors, formik.values);

    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Brand' : 'Update a Brand' }
                    </Text>

                    <FormikInput valueName="name" formik={formik} placeholder="Brand name:" label={formik.values.id == '' ? null : 'Name: '}/>

                    <View className="block w-full mt-2">
                    { formik.isSubmitting ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <PrimaryButton onPress={formik.handleSubmit}  message={formik.values.id == '' ? 'Store Brand' : 'Edit Brand'}/>
                    )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}