import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DangerButton } from '../../components/DangerButton';
import { MaterialIcons } from '@expo/vector-icons';

import { Feather } from '@expo/vector-icons';
import { Messages } from '../../components/Messages';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { useEffect } from 'react';
import { getGarage, deleteGarage } from '../../hooks/GarageApi';
import { GarageBranchesList } from './Partials/Branches/GarageBranchesList';
import { user } from '../../context/UserAttributesContext';
 

export const DetailGarage = ({navigation, route}) => {

    const { id } = route.params;
    
    const { data:garage, isLoading, isError, error, isFetching ,isSuccess} = getGarage(id);

    const deleteGarageMutation = deleteGarage(); //haber xd

    const handleGarageDelete = async() => {
        Alert.alert('Delete Garage', 'Are you sure you want to delete this Garage ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => {
                    deleteGarageMutation.mutate(garage?.data)
                }
            }
        ]);
    }
    return (
        <AuthenticateLayout level={route.params?.level} flashMessage={route.params?.flashMessage}>
            <Header navigation={navigation}/>
            
            <View className="flex flex-1 flex-col justify-center items-center" >
                {
                    isLoading || isFetching ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ): (
                        <>
                            {isError ? (
                                <View>
                                    <MaterialIcons name="error-outline" size={60} color="white" />
                                    <Messages message={`Here was a problem processing Owners : ${error.message}`} level={'error'}/>
                                </View>
                            ):null}

                            { isSuccess ? (
                                <>
                                    <View className="flex-none w-full max-w-sm" >
                                        <Card>
                                            <View className="flex flex-row justify-between">
                                                <View className="py-2">
                                                    <MaterialCommunityIcons name="warehouse" size={60} color="white" />
                                                </View>
                                                {
                                                    user.isAdmin && (user.type == 'Insurer' || user.type == 'Garage') ? (
                                                        <View>
                                                            <View>
                                                                <PrimaryButton onPress={() => (navigation.navigate('FormGarage',
                                                                    {id: garage?.data.id, name: garage?.data.name}))}
                                                                    message="Edit"
                                                                />
                                                            </View>
                                                           {/*  <View className="mt-2">
                                                                <DangerButton message="Delete" onPress={() => handleGarageDelete()} />
                                                            </View> */}
                                                        </View>
                                                    ):null
                                                }
                                            </View>
                                        </Card>
                                    </View>

                                    <View className="w-full max-w-sm">
                                        <Card >
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Name: </Text> {garage?.data.name}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>
                                    </View>
                                    <View className="w-full max-w-sm">
                                        <GarageBranchesList 
                                            navigation={navigation} 
                                            branches={garage?.data.branches}
                                            garage_id={garage?.data.id}
                                        />
                                    </View>
                                    
                                </>   
                            ) : null}
                        </>
                    )
                }
               
                <View className="flex-none w-full max-w-sm">
                    {
                        deleteGarageMutation.isLoading ? (
                            <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                        ):(
                            <View>
                                {deleteGarageMutation.isError ? (
                                    deleteGarageMutation.error.response.data.message ? (<Messages message={`${deleteGarageMutation.error.response.data.message}`} level={'error'}/>)
                                    : (<Messages message={`Here was a problem processing Form : ${deleteGarageMutation.error}`} level={'error'}/>)
                                ) : null}
                            </View>
                        )
                    }
                </View>
                
            </View>
          
       </AuthenticateLayout>
    ) 
}
