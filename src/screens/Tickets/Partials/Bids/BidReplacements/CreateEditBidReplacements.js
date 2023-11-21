import { View, Text, ActivityIndicator,Pressable, FlatList } from 'react-native';
import React,{useEffect, useRef, useState,useCallback} from 'react';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Messages } from '../../../../../components/Messages';
import {Header} from '../../../../../components/Header';
import { AuthenticateLayout } from '../../../../../layouts/AuthenticateLayout';
import { PrimaryButton } from '../../../../../components/PrimaryButton';
import { SecondaryButton } from '../../../../../components/SecondaryButton';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { FormikInput } from '../../../../../components/FormikInput';
import { SelectInput } from '../../../../../components/SelectInput';
import { TxtInput } from '../../../../../components/TxtInput';
import {createEditBidReplacement, getBidReplacements} from '../../../../../hooks/BidReplacementApi';
import { Card } from '../../../../../components/Card';

export const CreateEditBidReplacement = ({navigation, route}) => {
   
    const formik = useFormik({
        initialValues: {
            inventory_id: '',
            bid_id: route.params.bid_id ,
            replacement_id:'',
            quantity: '',
            price:'',
        },
        validationSchema: Yup.object().shape({
            bid_id: Yup.number().required(),
            inventory_id: Yup.number().required(),
            quantity: Yup.number().positive().required(),
        }),
        onSubmit: async (bid) => await createEditAttempt.mutateAsync(bid),
    });
    const createEditAttempt = createEditBidReplacement(formik.setErrors, formik.values);
    let replacements = getBidReplacements();

    useEffect(() => {
        if(replacements != null){
            replacements.filter((replacement) => {
                if(replacement.id == formik.values.inventory_id){
                    formik.setFieldValue('price', replacement.price);
                    formik.setFieldValue('replacement_id', replacement.replacement_id);
                }
            });
        }

    },[formik.values.inventory_id]);
    console.log(formik.values);
    return (
        <AuthenticateLayout>
            <Header navigation={navigation}/>

            <View className="flex-1 items-center justify-center p-8">
                <View className="w-full p-8 max-w-sm">
                    <Text className="text-lg font-extrabold text-gray-200 text-center mb-2">
                        { formik.values.id == '' ? 'Add new Bid for Replacements' : 'Update Bid for Replacements' }
                    </Text>
                    <Text className="text-red-500 capitalize-first mb-4">
                        { formik.touched?.bid_id && formik.errors?.bid_id }
                    </Text>
                    
                    {
                        replacements.length == 0 ? null : (
                            <>
                                <SelectInput selectedValue={formik.values.inventory_id} onValueChange={formik.handleChange('inventory_id')}
                                    DefaultPlaceholder="Replacement :" data={replacements}/>
                                <Text className="text-red-500 capitalize-first">
                                    { formik.touched?.inventory_id && formik.errors?.inventory_id }
                                </Text>
                                <View className="mt-4">
                                    <FormikInput valueName="quantity" formik={formik} placeholder="Quantity" label={formik.values.id == '' ? null : 'Quantity'}/>
                                </View>
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