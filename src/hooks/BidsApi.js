import axiosRoute from "../utils/route";
import { useEffect, useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchOneBid =  async(id) => (await axiosRoute.get('bids.show', id)).data;
export const getTicketBid = (id) => {
    const { data, isLoading, isError, error, isFetching ,isSuccess } = useQuery({
        queryKey: ['bid'], 
        queryFn: () => fetchOneBid(id), 
        onSuccess:(data) => (console.log(data.data)),
        onError : (error) => (console.log(error)),
        refetchOnWindowFocus:false
    });
    return { data, isLoading, isError, error, isFetching , isSuccess}
}
const fetchBidStatuses = async() => (await axiosRoute.get('bid.statuses')).data;
export const getBidStatuses = () => {
    const { data, isLoading, isError, error, isFetching ,isSuccess } = useQuery({
        queryKey: ['bid-statuses'], 
        queryFn: () => fetchBidStatuses(), 
        onSuccess:(data) => {console.log(data?.bid_statuses);},
        onError : (error) => {console.log(error);},
        refetchOnWindowFocus:false
    });
    return { data, isLoading, isError, error, isFetching , isSuccess}
}

const storeBid = (bid) => (axiosRoute.post('bids.store', null, bid));
const updateBid = (bid) => (axiosRoute.patch('bids.update', bid.id, bid));
export const createEditTicketBid = (formikErrors ,bid) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();
    return useMutation({
        mutationFn: (bid.id == '' ?  storeBid : updateBid),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'timespan': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['ticket']); 
            navigation.navigate('DetailTicket',{ level: 'success',  flashMessage: data?.data?.message, id: bid.ticket_id}); 
        },
    });
}

const destroyBid = (bid) => axiosRoute.delete('bids.destroy', bid.id);

export const deleteTicketBid = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyBid,
        
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries(['ticket']); 
            navigation.navigate('DetailTicket',{ level: 'success',  flashMessage: data?.data?.message});  
        },
    });
}