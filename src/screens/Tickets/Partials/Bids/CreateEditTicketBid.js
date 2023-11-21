import { View, Text, ActivityIndicator,Pressable } from 'react-native';
import React,{useEffect, useRef, useState} from 'react';
import { Feather } from '@expo/vector-icons';
import {Header} from '../../../../components/Header';
import { AuthenticateLayout } from '../../../../layouts/AuthenticateLayout';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { SecondaryButton } from '../../../../components/SecondaryButton';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { FormikInput } from '../../../../components/FormikInput';
import { SelectInput } from '../../../../components/SelectInput';
import { TxtInput } from '../../../../components/TxtInput';
import { createEditTicketBid, getBidStatuses } from '../../../../hooks/BidsApi';

export const CreateEditTicketBid = ({navigation, route}) => {
    const formik = useFormik({
        initialValues: {
            id: route.params.id ?? '',
            ticket_id: route.params.ticket_id ?? '',
            bid_status_id: route.params.bid_status_id ?? '',
            timespan: route.params.timespan ?? '',
            details: route.params.details ?? [{ id: '', name: '', price: 0 }],
        },
        validationSchema: Yup.object().shape({
            ticket_id: Yup.number().required(),
            bid_status_id: Yup.number().required(),
            timespan: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/).required(),
            details: Yup.array().required().min(1).of(
                Yup.object().shape({
                    id: Yup.number().nullable().integer(),
                    name: Yup.string().required().min(3).max(255),
                    price: Yup.number().positive().required().min(1),
                })
            )
        }),
        onSubmit: async (bid) => await createEditAttempt.mutateAsync(bid),
    });
    const createEditAttempt = createEditTicketBid(formik.setErrors, formik.values);
    const {data:bid} = getBidStatuses();

    const addNewItem = () => {
        formik.setValues({
          ...formik.values,
          details: [...formik.values.details, { id: '', name: '', price: 0 }],
        });
    };
    const removeLastItem = () => {
        const updatedDetails = [...formik.values.details];
        if (updatedDetails.length > 1) {
            updatedDetails.pop(); // Remove the last item
            formik.setValues({
            ...formik.values,
            details: updatedDetails,
            });
        }else{
            alert('You must have at least one detail item');
        }
    };
    console.log(formik.values);
    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Bid' : 'Update Bid' }
                    </Text>

                    <FormikInput valueName="timespan" formik={formik} placeholder="TimeSpan: (YYYY-MM-DD)" label={formik.values.id == '' ? null : 'TimeSpan: (YYYY-MM-DD)'}/>

                    <View className="flex flex-row justify-between mb-5">
                        <Pressable  className="px-2.5 py-2.5 rounded-full bg-blueC-100 "
                            onPress={() => addNewItem()}>
                            <Feather name="plus" size={24} color="white" />
                        </Pressable>
                        <View className="justify-end">
                            <Pressable className="px-2.5 py-2.5 rounded-full bg-red-500 " 
                                onPress={() => removeLastItem()}>
                                <Feather name="trash-2" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                    {
                        bid?.bid_statuses == null ? null : (
                            <>
                                <SelectInput selectedValue={formik.values.bid_status_id} onValueChange={formik.handleChange('bid_status_id')}
                                        DefaultPlaceholder="Status:" data={bid?.bid_statuses}/>
                                <Text className="text-red-500 capitalize-first">
                                    { formik.touched?.bid_status_id && formik.errors?.bid_status_id }
                                </Text>
                                <Text className="text-gray-200 text-lg font-bold mt-4 mb-4" >Bid Details:</Text> 
                                {
                                    formik.values.details.map((detail, index) => (
                                        <View key={index}>
                                            {/* Render form fields for each detail */}
                                            <TxtInput placeholder={'Name'} onChangeText={formik.handleChange(`details[${index}].name`)}
                                                onBlur={formik.handleBlur(`details[${index}].name`)} value={formik.values.details[index].name}/>

                                            <Text className="text-red-500 capitalize-first">
                                                { formik.touched?.details && formik.errors?.details && (
                                                    <Text>{formik.errors?.details[index]?.name}</Text>
                                                )}
                                            </Text>
                                            
                                            <TxtInput placeholder={'Price:'} onChangeText={formik.handleChange(`details[${index}].price`)}
                                                onBlur={formik.handleBlur(`details[${index}].price`)} value={formik.values.details[index].price}/>

                                            <Text className="text-red-500 capitalize-first">
                                                { formik.touched?.details && formik.errors?.details && (
                                                    <Text>{formik.errors?.details[index]?.price}</Text>
                                                )}
                                            </Text>
                                        </View>
                                    ))
                                }
                            </>
                        )
                    }
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