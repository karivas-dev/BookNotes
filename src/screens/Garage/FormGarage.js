import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';

import {Header} from '../../components/Header';

import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { Messages } from '../../components/Messages';
import { TxtInput } from '../../components/TxtInput';

import { PrimaryButton } from '../../components/PrimaryButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {FormikInput} from "../../components/FormikInput";
import { createEditGarage } from '../../hooks/GarageApi';

export const FormGarage = ({navigation, route}) => {

    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            name: route.params.name ?? '',
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required()
        }),
        onSubmit: async (garage) => await createEditAttempt.mutateAsync(garage)
    });
    const createEditAttempt = createEditGarage(formik.setErrors, formik.values);
    
    return (
        <AuthenticateLayout>
            
            <Header navigation={navigation}/>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Garage' : 'Update Garage' }
                    </Text>

                    <FormikInput valueName="name" formik={formik} placeholder="Garage name:" label={formik.values.id == '' ? null : 'Name: '}/>

                    <View className="block w-full mt-2">
                    { formik.isSubmitting ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <PrimaryButton onPress={formik.handleSubmit}  message={formik.values.id == '' ? 'Create Garage' : 'Edit Garage'}/>
                    )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
       

    )

}