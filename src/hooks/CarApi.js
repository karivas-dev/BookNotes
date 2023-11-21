import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchCars = async (page) => (await axiosRoute.get('cars.index', { page: page})).data;

const getCars = (page) => {
    const [cars,setCars] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['cars',page],
        queryFn: () => fetchCars(page), 
        onError: (error) => {
            console.log(error);
        },
        onSuccess:(data) => {
            if(data?.meta?.current_page === 1){
                setCars(data?.data);
            }else{
                setCars([...cars, ...data?.data]);
            }
        },
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , cars}
}

const fetchOneCar =  async(id) => (await axiosRoute.get('cars.show', id)).data;

const getCar = (id) => {
    const { data, isLoading, isError, error, isFetching ,isSuccess } = useQuery({
        queryKey: ['car'], 
        queryFn: () => fetchOneCar(id), 
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


const storeCar = (car) => (axiosRoute.post('cars.store', null, car));

const updateCar = (car) => (axiosRoute.put('cars.update', car.id, car));

const createEditCar = (formikErrors, car) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: (car.id == '' ? storeCar : updateCar),

        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'model_id': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['cars']); 
            navigation.navigate('Home', {
                screen: 'CarsList',
                params: {level: 'success', flashMessage: data?.data?.message, page: 1}
            });
        },
    });
}

const destroyCar = (car) => axiosRoute.delete('cars.destroy', car.id);

const deleteCar = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyCar,
        
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries('cars'); 
            navigation.navigate('Home',{screen: 'CarsList', params: { level: 'success',  flashMessage: data?.data?.message, page: 1}});
        },
    });
}

export {getCars, getCar, createEditCar ,deleteCar}