import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';

import { PrimaryButton } from '../../components/PrimaryButton';
import { DangerButton } from '../../components/DangerButton';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Messages } from '../../components/Messages';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { deleteBranch, getBranch } from '../../hooks/BranchApi';
import { useEffect } from 'react';
import { user } from '../../context/UserAttributesContext';

const showMain = (main) => {
    if(main){
        return "main"
    }
    else{
        return "regular"
    }
};

export const BranchDetail = ({navigation, route}) => {
    const { data:branch, isLoading, isError, error, isFetching ,isSuccess} = getBranch(route.params.id);

    const deleteBranchMutation = deleteBranch();

    const handleBranchDelete = async() => {
        Alert.alert('Delete Branch', 'Are you sure you want to delete this Branch ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => {
                    deleteBranchMutation.mutateAsync(branch?.data);
                }
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
                                                    <Feather name="git-branch" size={60} color="#F1F6F5" />
                                                </View>
                                                {
                                                    user.isAdmin  ? (
                                                        <View>
                                                           {/*  <View>
                                                                <PrimaryButton message='Edit' onPress={() => console.log('editar')}/>
                                                            </View> */}
                                                            {/* <View className="mt-2">
                                                                <DangerButton message="Delete" onPress={() => handleBranchDelete()} />
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
                                                <Text className="text-gray-200 text-lg font-bold" >Email: </Text> {branch?.data.email}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Telephone: </Text> {branch?.data.telephone}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Main: </Text> {showMain(branch?.data.branch)}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >District: </Text> {branch?.data.district_id}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>
                                    </View>
                                </>   
                            ) : null}
                        </>
                    )
                }
               
               <View className="flex-none w-full max-w-sm">
                    {
                        deleteBranchMutation.isLoading ? (
                            <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                        ):(
                            <View>
                                {deleteBranchMutation.isError ? (
                                    deleteBranchMutation.error.response.data.message ? (<Messages message={`${deleteBranchMutation.error.response.data.message}`} level={'error'}/>)
                                    : (<Messages message={`Here was a problem processing Form : ${deleteBranchMutation.error}`} level={'error'}/>)
                                ) : null}
                            </View>
                        )
                    }
                </View>
                
            </View>
          
       </AuthenticateLayout>
    ) 
}
