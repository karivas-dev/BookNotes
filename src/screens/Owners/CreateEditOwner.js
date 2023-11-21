import { View, Text, ActivityIndicator } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {Header} from '../../components/Header';

import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { SelectInput } from '../../components/SelectInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { createEditOwner } from '../../hooks/OwnerApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {FormikInput} from "../../components/FormikInput";
import getLocation from "../../hooks/LocationApi";

export const CreateEditOwner = ({navigation, route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            firstname: route.params.firstname ?? '',
            lastname: route.params.lastname ?? '',
            email: route.params.email ?? '',
            telephone: route.params.telephone ?? '',
            district_id: route.params.district_id ?? ''
        },
        validationSchema: Yup.object().shape({
            firstname: Yup.string().required(),
            lastname: Yup.string().required(),
            email: Yup.string().required().email(),
            telephone: Yup.string().required().matches("^(2|6|7|8)[0-9]{7}$"),
            district_id: Yup.string().required()
        }),
        onSubmit: async (owner) => await createEditAttempt.mutateAsync(owner),
    });
    const createEditAttempt = createEditOwner(formik.setErrors, formik.values);

    const [selectedLocation, setSelectedLocation] = useState({state_id: 0, town_id: 0});
    const location = getLocation();

    const firstTime = useRef(true);
    useEffect(() => {
        const district_id = formik.values.district_id;
        if (district_id != '' && location) {
            const town_id = location?.districts.find(d => d.id == formik.values.district_id).town_id;
            setSelectedLocation({
                ...selectedLocation,
                state_id: location?.towns.find(t => t.id == town_id).state_id,
                town_id: town_id,
            });
            formik.setFieldValue('district_id', district_id);
        }
    }, [location]);

    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>
            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-4">{ formik.values.id  == '' ? 'Add new Owner' : 'Update a Owner' }</Text>
                    <FormikInput valueName="firstname" formik={formik} placeholder="Nombre"/>
                    <FormikInput valueName="lastname" formik={formik} placeholder="Apellido"/>
                    <FormikInput valueName="email" formik={formik} placeholder="Correo Eletrónico"/>
                    <FormikInput valueName="telephone" formik={formik} placeholder="Teléfono"/>

                    {location == null ? null : ( <>
                        <SelectInput selectedValue={selectedLocation.state_id} onValueChange={(id) => setSelectedLocation({state_id: id, town_id: 0})}
                                     DefaultPlaceholder="Selecciona Departamento" data={location?.states}/>
                        <SelectInput selectedValue={selectedLocation.town_id}
                                     onValueChange={(id) => {setSelectedLocation({...selectedLocation, town_id: id}); formik.setFieldValue('district_id', '');}}
                                     DefaultPlaceholder="Selecciona Municipio" data={location?.towns.filter(t => t.state_id == selectedLocation.state_id)}/>
                        <SelectInput selectedValue={formik.values.district_id} onValueChange={formik.handleChange('district_id')}
                                     DefaultPlaceholder="Selecciona Distrito" data={location?.districts.filter(d => d.town_id == selectedLocation.town_id)}/>
                        <Text className="text-red-500 capitalize-first">
                            { formik.touched?.district_id && formik.errors?.district_id }
                        </Text>
                    </>)}

                    {createEditAttempt.isLoading ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <View className="block w-full mt-4">
                            <PrimaryButton onPress={formik.handleSubmit}  message={formik.values.id == '' ? 'Store Owner' : 'Edit Owner'}/>
                        </View>
                    )}
                </View>
            </View>
        </AuthenticateLayout>
    )
}