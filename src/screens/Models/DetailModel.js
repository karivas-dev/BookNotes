import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';

import { FontAwesome } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DangerButton } from '../../components/DangerButton';

import { MaterialIcons } from '@expo/vector-icons';
import { Messages } from '../../components/Messages';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { deleteModel } from '../../hooks/ModelApi';
import { getModel } from '../../hooks/ModelApi';
import { user } from '../../context/UserAttributesContext';

export const DetailModel = ({navigation, route}) => {
      
    const { data:model, isLoading, isError, error,isFetching ,isSuccess} = getModel(route.params.id);

    const deleteModelMutation = deleteModel();

    const handleBrandDelete = async() => {
        Alert.alert('Delete Model', 'Are you sure you want to delete this Model ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Confirm',
                onPress: () => deleteModelMutation.mutateAsync(model?.data)
            }
        ]);
    }

    return (
        <AuthenticateLayout>
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
                                                    <Text className="text-gray-200 text-lg font-bold text-center">{model?.data.name}</Text>
                                                </View>
                                            </View>
                                            {
                                                user.type != 'Garage' ? (
                                                    <View className="py-2">
                                                        <PrimaryButton message='Edit' onPress={() => navigation.navigate('CreateEditModel', { 
                                                            id: route.params.id , 
                                                            name: model?.data.name,
                                                            brand_id: route.params.brandId
                                                        })}/>
                                                        {/* <View className="mt-2">
                                                            <DangerButton message="delete" onPress={() => handleBrandDelete()}/>
                                                        </View>      */}                                                 
                                                    </View>
                                                ):null
                                            }
                                        </>   
                                    ) : null}
                                </View> 
                            )
                        }
                    </Card>
                    <View className="max-w-sm p-6 rounded-lg">
                        {
                            deleteModelMutation.isLoading ? (
                                <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                            ):(
                                <View>
                                    {deleteModelMutation.isError ? (
                                        deleteModelMutation.error.response.data.message ?  (
                                            <Messages message={`${deleteModelMutation.error.response.data?.message}`} level={'error'}/>
                                        ):(
                                            <Messages message={`Here was a problem processing Form : ${deleteModelMutation.error}`} level={'error'}/>
                                        )   
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