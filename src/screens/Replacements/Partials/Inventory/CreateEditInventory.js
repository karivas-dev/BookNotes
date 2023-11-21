import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

import { Header } from '../../../../components/Header';

import { AuthenticateLayout } from '../../../../layouts/AuthenticateLayout';

import { PrimaryButton } from '../../../../components/PrimaryButton';

import { useFormik } from "formik";
import * as Yup from 'yup';
import { FormikInput } from "../../../../components/FormikInput";
import { createEditInventory } from '../../../../hooks/ReplacementApi';

export const CreateEditInventory = ({navigation, route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            replacement_id: route.params.replacement_id ,
            quantity: route.params.quantity ?? '',
            unit_price: route.params.unit_price ?? '',
        },
        validationSchema: Yup.object().shape({
            quantity: Yup.number().integer().positive().required(),
            unit_price: Yup.number().positive().required(),
        }),
        onSubmit: async (inventory) => await createEditAttempt.mutateAsync(inventory),
    });
    const createEditAttempt = createEditInventory(formik.setErrors, formik.values);

    return(
        <AuthenticateLayout>
            <Header navigation={navigation} />

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        {formik.values.id == "" ? "Add new Inventory" : "Update Inventory"}
                    </Text>

                    <FormikInput valueName={'quantity'} formik={formik} placeholder="Quantity: " label={formik.values.id == '' ? null : 'Quantity: '} />
                    <FormikInput valueName={'unit_price'} formik={formik} placeholder="Unit Price: " label={formik.values.id == '' ? null : 'Unit Price: '}/>
      
                    <View className="block w-full mt-2">
                        {formik.isSubmitting ? (<ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>) : (
                            <PrimaryButton onPress={formik.handleSubmit} message={formik.values.id == "" ? "Store Inventory" : "Edit Inventory"} />
                        )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}