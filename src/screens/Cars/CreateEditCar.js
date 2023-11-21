import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

import {Header} from '../../components/Header';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { PrimaryButton } from '../../components/PrimaryButton';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { FormikInput } from '../../components/FormikInput';
import { SelectInput } from '../../components/SelectInput';
import { createEditCar } from '../../hooks/CarApi';
import { getBrands } from '../../hooks/BrandApi';
import { getSelectModels } from '../../hooks/ReplacementApi';

export const CreateEditCar = ({navigation, route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            plates: route.params.plates ?? '',
            serial_number: route.params.serial_number ?? '',
            owner_id: route.params.owner_id ?? '',
            brand_id: route.params.brand_id ?? '',
            model_id: route.params.model_id ?? '',
        },
        validationSchema: Yup.object().shape({
            plates: Yup.string().min(7).max(255).matches(/^[A-Z0-9]{7}$/).required(),
            serial_number: Yup.string().max(255).required(),
            owner_id: Yup.number().required(),
            brand_id: Yup.number().required(),
            model_id: Yup.number().required(),
        }),
        onSubmit: async (car) => await createEditAttempt.mutateAsync(car),
    });

    const createEditAttempt = createEditCar(formik.setErrors, formik.values);
    const { brands } = getBrands(1);
    let models = getSelectModels(formik.values.brand_id);
    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Car' : 'Update Car' }
                    </Text>

                    <FormikInput valueName="plates" formik={formik} placeholder="Plates:" label={formik.values.id == '' ? null : 'Plates: '}/>
                    <FormikInput valueName="serial_number" formik={formik} placeholder="Serial Number:" label={formik.values.id == '' ? null : 'Serial Number: '}/>

                    {brands == null ? null : (
                        <>
                            <SelectInput selectedValue={formik.values.brand_id} onValueChange={formik.handleChange('brand_id')}
                                DefaultPlaceholder="Select a Brand" data={brands} />
                            
                            <Text className="text-red-500 capitalize-first">
                                {formik.touched?.brand_id && formik.errors?.brand_id}
                            </Text>

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
                    { formik.isSubmitting ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <PrimaryButton onPress={formik.handleSubmit}  message={formik.values.id == '' ? 'Store Car' : 'Edit Car'}/>
                    )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}