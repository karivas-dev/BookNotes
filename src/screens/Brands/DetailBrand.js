import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';

import { FontAwesome } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import  { SecondaryButton } from '../../components/SecondaryButton';
import { DangerButton } from '../../components/DangerButton';
import { ModelList } from '../Models/ModelsList';

import { MaterialIcons } from '@expo/vector-icons';
import { Messages } from '../../components/Messages';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { deleteBrand, getBrand } from '../../hooks/BrandApi';
import { user } from '../../context/UserAttributesContext';

export const DetailBrand = ({navigation, route}) => {
    
    const { id } = route.params;
    
    const { data:brand, isLoading, isError, error,isFetching ,isSuccess} = getBrand(id);

    const deleteBrandMutation = deleteBrand();

    const handleBrandDelete = async() => {
        Alert.alert('Delete Brand', 'Are you sure you want to delete this Brand ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => {
                    deleteBrandMutation.mutate(brand?.data);
                }
            }
        ]);
    }

    return (
        <AuthenticateLayout level={route.params?.level} flashMessage={route.params?.flashMessage}>
            <Header navigation={navigation}/>
            <View className="flex flex-1 flex-col justify-center items-center" >
               <View className="flex-none w-full max-w-sm" >
                    <Card>
                        { 
                            isLoading || isFetching ? (
                                <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                            ) : (
                                <View className="flex flex-row justify-between">
                                    {isError ? (
                                        <View>
                                            <MaterialIcons name="error-outline" size={60} color="white" />
                                            <Messages message={`Here was a problem processing Brands : ${error.message}`} level={'error'}/>
                                        </View>
                                    ):null}

                                    { isSuccess ? (
                                        <>
                                            <View className="py-2">
                                                <FontAwesome name="th-list" size={62} color="white" />
                                                <View className="mt-4">
                                                    <Text className="text-gray-200 text-lg font-bold text-center">{brand?.data.name}</Text>
                                                </View>
                                            </View>
                                            <View className="py-2">
                                                {
                                                    user.type != 'Garage' ? (
                                                        <>
                                                            <PrimaryButton message='Edit' onPress={() => navigation.navigate('CreateEditBrand',
                                                             { id: id , name: brand?.data.name})}/>
                                                            <View className="mt-2">
                                                                <DangerButton message="delete" onPress={() => handleBrandDelete()}/>
                                                            </View>
                                                        </>
                                                        
                                                    ):null
                                                }                          
                                            </View>
                                        </>   
                                    ) : null}
                                </View> 
                            )
                        }
                    </Card>
                    
                    <ModelList
                        navigation={navigation}
                        route={route}
                    />
                    
                    <View className="max-w-sm p-6 rounded-lg">
                        {
                            deleteBrandMutation.isLoading ? (
                                <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                            ):(
                                <View>
                                    {deleteBrandMutation.isError ? (
                                        <Messages message={`Here was a problem processing Form : ${deleteBrandMutation.error}`} level={'error'}/>
                                    ) : null}
                                </View>
                            )
                        }
                    </View>
                </View>
            </View> 
       </AuthenticateLayout>
    ) 
}