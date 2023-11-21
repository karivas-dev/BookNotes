import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

import { Header } from '../../components/Header';

import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';

import { PrimaryButton } from '../../components/PrimaryButton';

import { useFormik } from "formik";
import * as Yup from 'yup';
import { FormikInput } from "../../components/FormikInput";
import { createEditReplacement, getSelectModels } from '../../hooks/ReplacementApi';
import { SelectInput } from '../../components/SelectInput';
import { getBrands } from '../../hooks/BrandApi';


export const EditCreateReplacement = ({navigation,route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? "",
            name: route.params.name ?? "",
            description: route.params.description ?? "",
            brand_id: route.params.brand_id ?? "",
            model_id: route.params.model_id ?? "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(),
            description: Yup.string().required(),
            brand_id: Yup.number().required(),
            model_id: Yup.number().required(),
        }),
        onSubmit: async (replacement) => await createEditAttempt.mutateAsync(replacement),
    });
    const createEditAttempt = createEditReplacement(formik.setErrors, formik.values);

    const { brands } = getBrands(1);
    let models = getSelectModels(formik.values.brand_id);
  
    return(
        <AuthenticateLayout>
            <Header navigation={navigation} />

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        {formik.values.id == "" ? "Add new Replacement" : "Update Replacement"}
                    </Text>

                    <FormikInput valueName={'name'} formik={formik} placeholder="Name" />
                    <FormikInput valueName={'description'} formik={formik} placeholder="Description" />

                    {brands == null ? null : (
                        <>
                            <SelectInput selectedValue={formik.values.brand_id} onValueChange={formik.handleChange('brand_id')}
                                DefaultPlaceholder="Select a Brand" data={brands} />

                            {models == null ? null : (
                                <SelectInput selectedValue={formik.values.model_id}
                                    onValueChange={formik.handleChange('model_id')}
                                    DefaultPlaceholder="Select a Model"
                                    data={models} 
                                />
                            )}

                            <Text className="text-red-500 capitalize-first">
                                {formik.touched?.model_id && formik.errors?.model_id}
                            </Text>
                        </>
                    )}

                    <View className="block w-full mt-2">
                        {formik.isSubmitting ? (<ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>) : (
                            <PrimaryButton onPress={formik.handleSubmit} message={formik.values.id == "" ? "Store Replacement" : "Edit Replacement"} />
                        )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}