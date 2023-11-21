import {View, Text, Image, ActivityIndicator, Alert} from 'react-native';
import { AuthenticateLayout } from '../../layouts/AuthenticateLayout';
import { Header } from '../../components/Header';
import { FontAwesome } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DangerButton } from '../../components/DangerButton';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TicketBidList } from './Partials/Bids/TicketBidList';
import { MaterialIcons } from '@expo/vector-icons';
import { Messages } from '../../components/Messages';
import { Card } from '../../components/Card';
import { deleteTicket, getTicket } from '../../hooks/TicketApi';
import { user } from '../../context/UserAttributesContext';

export const DetailTicket = ({navigation, route}) => {

    const { data:ticket, isLoading, isError, error, isFetching ,isSuccess} = getTicket(route.params.id);

    const deleteTicketMutation = deleteTicket();

    const handleDelete = async() => {
        Alert.alert('Delete Ticket', 'Are you sure you want to delete this Ticket ?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => deleteTicketMutation.mutateAsync(ticket?.data)
            }
        ]);
    }

    return (
        <AuthenticateLayout level={route.params?.level} flashMessage={route.params?.flashMessage}>
            <Header navigation={navigation}/>
            <View className="flex-none w-full max-w-sm">
                {
                    deleteTicketMutation.isLoading ? (
                        <ActivityIndicator size="large" style={{marginVertical:16}} color="white"/>
                    ):(
                        <View>
                            {deleteTicketMutation.isError ? (
                                deleteTicketMutation.error.response.data.message ?  (
                                    <Messages message={`${deleteTicketMutation.error.response.data?.message}`} level={'error'}/>
                                    ):(<Messages message={`Here was a problem processing Ticket : ${deleteTicketMutation.error}`} level={'error'}/>)   
                                ) 
                            : null}
                        </View>
                    )
                }
            </View>
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
                                                    <Ionicons name="receipt" size={62} color="#F1F6F5" />
                                                </View>
                                                {
                                                    user.type == 'Insurer' || user.type == 'Garage' ? (
                                                        <View>
                                                            <PrimaryButton message='Edit' onPress={() =>  navigation.navigate("CreateEditTicket", {
                                                                id: ticket?.data.id,
                                                                description: ticket?.data.description,
                                                                car_id: ticket?.data.car.id,
                                                                garage_id: ticket?.data.garage.id,
                                                                ticket_status_id: ticket?.data.status_id,
                                                            })}/>
                                                        </View>
                                                    ):null
                                                }
                                                {
                                                    user.type == 'Insurer' ? (
                                                        <View className="mt-2">
                                                            <DangerButton message="Delete" onPress={() => handleDelete()} />
                                                        </View>
                                                    ):null
                                                }
                                            </View>
                                        </Card>
                                    </View>

                                    <View className="w-full max-w-sm">
                                        <Card>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Ticket ID #: </Text> {ticket?.data.id}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Description : </Text> {ticket?.data.description}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Status: </Text> {ticket?.data.status}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Garage: </Text> {ticket?.data.garage.name}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>
                                        {
                                            user.type == 'Insurer' || user.type == 'Garage' ? (
                                                <View className="w-full max-w-sm">
                                                    <TicketBidList 
                                                        navigation={navigation} 
                                                        bids={ticket?.data.bids}
                                                        ticket_id={ticket?.data.id}
                                                    />
                                                </View>
                                            ):null
                                        }
                                        <Card>
                                            <Text className="font-extrabold mb-3 text-center text-gray-200 mt-3 text-2xl">Car Details</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Plates #: </Text> {ticket?.data.car.plates}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Serial #: </Text> {ticket?.data.car.serial_number}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>
                                        <Card>
                                            <Text className="font-extrabold mb-3 text-center text-gray-200 mt-3 text-2xl">Branch {ticket?.data.branch.branchable_type} Details</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" >Main: </Text> {ticket?.data.branch.main ? 'Yes' : 'No'}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" > Email: </Text> {ticket?.data.branch.email}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" > Phone: </Text> {ticket?.data.branch.telephone}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" > District: </Text> {ticket?.data.branch.district_id}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>
                                        <Card>
                                            <Text className="font-extrabold mb-3 text-center text-gray-200 mt-3 text-2xl">User {ticket?.data.user.firstname}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" > Email: </Text> {ticket?.data.user.email}
                                            </Text><Text>{`\n`}</Text>
                                            <Text className="text-gray-200 text-lg text-center" > 
                                                <Text className="text-gray-200 text-lg font-bold" > Phone: </Text> {ticket?.data.user.telephone}
                                            </Text><Text>{`\n`}</Text>
                                        </Card>
                                    </View>
                                </>   
                            ) : null}
                        </>
                    )
                }
            </View>
       </AuthenticateLayout>
    );
}