import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';

import { FontAwesome } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DangerButton } from '../../components/DangerButton';
import { MaterialIcons } from '@expo/vector-icons';

import { Feather } from '@expo/vector-icons';
import { Messages } from '../../components/Messages';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { deleteOwner, getOwner } from '../../hooks/OwnerApi';
import { useEffect } from 'react';
import { OwnerCarsList } from './Partials/Cars/OwnerCarsList';
import { user } from '../../context/UserAttributesContext';

export const DetailOwner = ({navigation, route}) => {
    const { data:owner, isLoading, isError, error, isFetching ,isSuccess} = getOwner(route.params.id);

    const deleteOwnerMutation = deleteOwner();

    const handleOwnerDelete = async() => {
        Alert.alert('Delete Owner', 'Are you sure you want to delete this Owner ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => deleteOwnerMutation.mutateAsync(owner?.data)
            }
        ]);
    }
    return (
        <AuthenticateLayout>
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
                                                    <Feather name="user" size={62} color="#F1F6F5" />
                                                </View>
                                                {
                                                    user.type == 'Insurer' ? (
                                                        <View>
                                                            <View>
                                                                <PrimaryButton message='Edit' onPress={() => navigation.navigate('CreateEditOwner',{
                                                                        id: owner?.data.id,
                                                                        firstname: owner?.data.firstname,
                                                                        lastname: owner?.data.lastname,
                                                                        email: owner?.data.email,
                                                                        telephone: owner?.data.telephone,
                                                                        district_id: owner?.data.district_id
                                                                    })
                                                                }/>
                                                            </View>
                                                        
                                                            <View className="mt-2">
                                                                <DangerButton message="Delete" onPress={() => handleOwnerDelete()} />
                                                            </View>
                                                        </View>
                                                    ):null
                                                }
                                            </View>
                                        </Card>
                                    </View>

                                    <View className="w-full max-w-sm">
                                        <Card >
                                            <Text className="text-gray-200 text-lg font-bold text-center" >{owner?.data.firstname}, {owner?.data.lastname}</Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Email: </Text> {owner?.data.email}
                                            </Text><Text>{`\n`}</Text>

                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Phone: </Text> {owner?.data.telephone}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >District: </Text> {owner?.data.district_id}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>
                                    </View>
                                    <View className="w-full max-w-sm"> 
                                        <OwnerCarsList
                                            cars={owner?.data.cars}
                                            owner_id = {owner?.data.id}
                                            navigation={navigation}
                                        />
                                    </View>
                                </>   
                            ) : null}
                        </>
                    )
                }
               
               <View className="flex-none w-full max-w-sm">
                    {
                        deleteOwnerMutation.isLoading ? (
                            <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                        ):(
                            <View>
                                {deleteOwnerMutation.isError ? (
                                    <Messages message={`Here was a problem processing Form : ${deleteOwnerMutation.error}`} level={'error'}/>
                                ) : null}
                            </View>
                        )
                    }
                </View>
                
            </View>
          
       </AuthenticateLayout>
    ) 
}
