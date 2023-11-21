import axiosRoute from "../utils/route";
import { useEffect, useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchTickets = async (page) => (await axiosRoute.get('tickets.index', { page: page})).data;
const getTickets = (page) => {
    const [tickets,setTickets] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['tickets',page],
        queryFn: () => fetchTickets(page), 
        onError: (error) => {
            console.log(error);
        },
        onSuccess:(data) => {
            if(data?.meta?.current_page === 1){
                setTickets(data?.data);
            }else{
                setTickets([...tickets, ...data?.data]);
            }
        },
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , tickets}
}

const fetchOneTicket =  async(id) => (await axiosRoute.get('tickets.show', id)).data;
const getTicket = (id) => {
    const { data, isLoading, isError, error, isFetching ,isSuccess } = useQuery({
        queryKey: ['ticket'], 
        queryFn: () => fetchOneTicket(id), 
        onSuccess:(data) => {
            console.log(data.data);
        },
        onError : (error) => {
            console.log(error);
        },
        refetchOnWindowFocus:false
    });

    return { data, isLoading, isError, error, isFetching , isSuccess}
}

const fetchTicketStatuses = async() => (await axiosRoute.get('ticket.statuses')).data;
const getTicketStatuses = () => {
    const { data, isLoading, isError, error, isFetching ,isSuccess } = useQuery({
        queryKey: ['ticket-statuses'], 
        queryFn: () => fetchTicketStatuses(), 
        onSuccess:(data) => {console.log(data?.ticket_statuses);},
        onError : (error) => {console.log(error);},
        refetchOnWindowFocus:false
    });
    return { data, isLoading, isError, error, isFetching , isSuccess}
}
//Pikers
const fetchGarages  = async (page) => (await axiosRoute.get('garages.index', { page: page})).data;
const getGarages = () => {
    const [allData, setAllData] = useState([]); // Estado para almacenar todos los datos
    useEffect(() => {
        async function fetchData() {
            const data = await fetchGarages(1);
            let allDataArray = [];
            if(data.data.length == 0 ){
                setAllData([{id:'', name:'No Garages found'}]);
            }
            else{
                for (let page = 1; page <= data.meta?.last_page; page++) {
                    const response = await fetchGarages(page);
                    allDataArray = [...allDataArray, ...response.data];
                }
                setAllData(allDataArray);
            }
        }
        fetchData();
    }, []);
    return allData;
}

const fetchCars = async (page) => (await axiosRoute.get('cars.index', {page: page})).data;
const getCars = () => {
    const [allData, setAllData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const data = await fetchCars(1);
            let allDataArray = [];
            if(data.data.length == 0 ){
                setAllData([{id:'', name:'No Cars found'}]);
            }
            else{
                for (let page = 1; page <= data.meta?.last_page; page++) {
                    const response = await fetchCars(page);
                    const formattedData = response.data.map(car => ({ id: car.id, name: car.plates }));
                    allDataArray = [...allDataArray, ...formattedData];
                }
                setAllData(allDataArray);
            }
        }
        fetchData();
    }, []);
    return allData;
}

const storeTicket = (ticket) => axiosRoute.post('tickets.store', null, ticket);
const updateTicket = (ticket) => axiosRoute.put('tickets.update', ticket.id, ticket);
const createEditTicket = (formikErrors, ticket) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: (ticket.id == '' ? storeTicket : updateTicket),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'ticket_status_id': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['tickets']); 
            navigation.navigate('TicketsList', { level: 'success',  flashMessage: data?.data?.message, page: 1});
        },
    });
}

const destroyTicket = (ticket) => axiosRoute.delete('tickets.destroy', ticket.id);

const deleteTicket = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyTicket,
        
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries('tickets'); 
            navigation.navigate('TicketsList', { level: 'success',  flashMessage: data?.data?.message, page: 1});
        },
    });
}


export {getTickets, getTicket ,getCars,getGarages,getTicketStatuses, createEditTicket, deleteTicket};