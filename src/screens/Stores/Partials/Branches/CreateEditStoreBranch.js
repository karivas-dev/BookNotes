import { View, Text, ActivityIndicator } from 'react-native';
import React,{useEffect, useRef, useState} from 'react';

import {Header} from '../../../../components/Header';
import { AuthenticateLayout } from '../../../../layouts/AuthenticateLayout';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { FormikInput } from '../../../../components/FormikInput';
import { SelectInput } from '../../../../components/SelectInput';
import getLocation from '../../../../hooks/LocationApi';
import { createEditStoreBranch } from '../../../../hooks/StoreApi';
import { TxtInput } from '../../../../components/TxtInput';
import { Messages } from '../../../../components/Messages';


export const CreateEditStoreBranch = ({navigation, route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            email: route.params.email ?? '',
            telephone: route.params.telephone ?? '',
            main: route.params.main ?? '',
            district_id: route.params.district_id ?? '',
            branchable_id: route.params.branchable_id ?? '',
            branchable_type: route.params.branchable_type ?? '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required().email(),
            telephone: Yup.string().required().matches("^(2|6|7|8)[0-9]{7}$"),
            main: Yup.bool().required(),
            district_id: Yup.string().required(),
            branchable_id: Yup.number().required(),
            branchable_type: Yup.string().required(),
        }),
        onSubmit: async (branch) => await createEditAttempt.mutateAsync(branch),
    });
    const createEditAttempt = createEditStoreBranch(formik.setErrors, formik.values);
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
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Branch to this Store' : 'Update Branch' }
                    </Text>

                    <FormikInput valueName="email" formik={formik} placeholder="Store Email:" label={formik.values.id == '' ? null : 'Store Email: '}/>
                    <FormikInput valueName="telephone" formik={formik} placeholder="Store Telephone:" label={formik.values.id == '' ? null : 'Store Telephone: '}/>

                    <SelectInput selectedValue={formik.values.main} onValueChange={formik.handleChange('main')}
                            DefaultPlaceholder="Is Main ?" data={[{id:1,name:'Yes'},{id:0,name:'No'}]}/>
                    <Text className="text-red-500 capitalize-first">
                        { formik.touched?.main && formik.errors?.main }
                    </Text>     

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

                    <View className="block w-full mt-2">
                    { formik.isSubmitting ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <PrimaryButton onPress={formik.handleSubmit}  message={formik.values.id == '' ? 'Store' : 'Edit'}/>
                    )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}