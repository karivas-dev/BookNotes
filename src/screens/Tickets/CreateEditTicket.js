import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

import {Header} from '../../components/Header';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { PrimaryButton } from '../../components/PrimaryButton';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { FormikInput } from '../../components/FormikInput';
import { SelectInput } from '../../components/SelectInput';

import { createEditTicket, getGarages, getCars, getTicketStatuses } from '../../hooks/TicketApi';
import { user } from '../../context/UserAttributesContext';

export const CreateEditTicket = ({navigation, route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            description : route.params.description ?? '',
            garage_id : route.params.garage_id ?? '',
            car_id : route.params.car_id ?? '',
            ticket_status_id: route.params.ticket_status_id ?? '',
        },
        validationSchema: Yup.object().shape({
            description: Yup.string().min(7).max(255).required(),
            garage_id: Yup.number().required(),
            car_id: Yup.number().required(),
            ticket_status_id: Yup.number().required(),
        }),
        onSubmit: async (ticket) => await createEditAttempt.mutateAsync(ticket),
    });

    const createEditAttempt = createEditTicket(formik.setErrors, formik.values);
    const { data:ticket } = getTicketStatuses();
    let cars  = getCars();
    let garages = getGarages();
    /* console.log(formik.values); */
    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Ticket' : 'Update Ticket' }
                    </Text>

                    <FormikInput multiline={true} rows={4} valueName="description" 
                    formik={formik} placeholder="Description:" label={formik.values.id == '' ? null : 'Description: '}/>

                    {
                        user.type == 'Insurer' ? (
                            <>
                                {cars == null ? null : (
                                    <>
                                        <SelectInput selectedValue={formik.values.car_id}
                                            onValueChange={formik.handleChange('car_id')}
                                            DefaultPlaceholder="Select a Car"
                                            data={cars} 
                                        />
                                        <Text className="text-red-500 capitalize-first">
                                            {formik.touched?.car_id && formik.errors?.car_id}
                                        </Text>
                                    </>
                                )}
                                {garages == null ? null : (
                                    <>
                                        <SelectInput selectedValue={formik.values.garage_id}
                                            onValueChange={formik.handleChange('garage_id')}
                                            DefaultPlaceholder="Select a Garage"
                                            data={garages} 
                                        />
                                        <Text className="text-red-500 capitalize-first">
                                            {formik.touched?.garage_id && formik.errors?.garage_id}
                                        </Text>
                                    </>
                                )}
                            </> 
                        ): null
                    }
                    
                    {ticket?.ticket_statuses == null ? null : (
                        <>
                            <SelectInput selectedValue={formik.values.ticket_status_id} onValueChange={formik.handleChange('ticket_status_id')}
                                DefaultPlaceholder="Select a Ticket Status" data={ticket.ticket_statuses} />
                            
                            <Text className="text-red-500 capitalize-first">
                                {formik.touched?.ticket_status_id && formik.errors?.ticket_status_id}
                            </Text> 
                        </>
                    )}

                    <View className="block w-full mt-2">
                    { formik.isSubmitting ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ) : (
                        <PrimaryButton onPress={formik.handleSubmit}  message={formik.values.id == '' ? 'Store Ticket' : 'Edit Ticket'}/>
                    )}
                    </View>
                </View>
            </View>
        </AuthenticateLayout>
    )
}