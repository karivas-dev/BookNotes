import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { Header } from '../../components/Header';
import { FontAwesome } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DangerButton } from '../../components/DangerButton';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Messages } from '../../components/Messages';
import { Card } from '../../components/Card';
import { deleteCar, getCar } from '../../hooks/CarApi';
import { user } from '../../context/UserAttributesContext';

export const DetailCar = ({navigation, route}) => {

    const { data:car, isLoading, isError, error, isFetching ,isSuccess} = getCar(route.params.id);

    const deleteCarMutation = deleteCar();

    const handleDelete = async() => {
        Alert.alert('Delete Car', 'Are you sure you want to delete this Car ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => {
                    deleteCarMutation.mutateAsync(car?.data);
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
                                 error.response.data?.message ? (
                                    <View>
                                        <MaterialIcons name="error-outline" size={60} color="white" />
                                        <Messages message={`${error.response.data?.message}`} level={'error'}/>

                                    </View>
                                ) 
                                : (<Messages message={`Here was a problem processing Car : ${error.message}`} level={'error'}/>)
                               
                            ):null}

                            { isSuccess ? (
                                <>
                                    <View className="flex-none w-full max-w-sm" >
                                        <Card>
                                            <View className="flex flex-row justify-between">
                                                <View className="py-2">
                                                    <MaterialCommunityIcons name="car" size={62} color="#F1F6F5" />
                                                </View>
                                                {
                                                    user.type == 'Insurer' ? (
                                                        <View>
                                                            <View>
                                                                <PrimaryButton message='Edit' onPress={() => (navigation.navigate('CreateEditCar',{ 
                                                                    id: car?.data.id,
                                                                    plates: car?.data.plates,
                                                                    serial_number: car?.data.serial_number,
                                                                    owner_id: car?.data.owner.id,
                                                                    brand_id: car?.data.model.brand.id,
                                                                    model_id: car?.data.model.id,
                                                                }))}/>
                                                            </View>
                                                            <View className="mt-2">
                                                                <DangerButton message="Delete" onPress={() => handleDelete()} />
                                                            </View>
                                                        </View>
                                                    ):null
                                                }
                                            </View>
                                        </Card>
                                    </View>

                                    <View className="w-full max-w-sm">
                                        <Card >
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Plates #: </Text> {car?.data.plates}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Serial #: </Text> {car?.data.serial_number}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Brand: </Text> {car?.data.model.brand.name}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Model: </Text> {car?.data.model.name}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>

                                        <Card>
                                            <Text className="font-extrabold mb-3 text-center text-gray-200 mt-3 text-2xl">Owner Details</Text>
                                            <Text className="text-gray-200 text-lg font-bold text-center" >{car?.data.owner.firstname}, {car?.data.owner.lastname}</Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Email: </Text> {car?.data.owner.email}
                                            </Text><Text>{`\n`}</Text>

                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Phone: </Text> {car?.data.owner.telephone}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >District: </Text> {car?.data.owner.district_id}
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
                        deleteCarMutation.isLoading ? (
                            <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                        ):(
                            <View>
                                {deleteCarMutation.isError ? (
                                    deleteCarMutation.error.response.data.message ?  (
                                        <Messages message={`${deleteCarMutation.error.response.data?.message}`} level={'error'}/>
                                        ):(<Messages message={`Here was a problem processing Form : ${deleteCarMutation.error}`} level={'error'}/>)   
                                    ) 
                                : null}
                            </View>
                        )
                    }
                </View>
                
            </View>
          
       </AuthenticateLayout>
    );
}