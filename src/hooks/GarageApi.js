import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchGarages  = async (page) => (await axiosRoute.get('garages.index', { page: page})).data;

const getGarages = (page) => {
    const [garages,setGarages] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['garages',page],
        queryFn: () => fetchGarages(page), 
        onError: (error) => {
            console.log(error);
        },
        onSuccess:(data) => {
            if(data?.meta?.current_page === 1){
                setGarages(data?.data);
            }else{
                setGarages([...garages, ...data?.data]);
            }
        },
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , garages}
}

const fetchOneGarage = async (id) => (await axiosRoute.get('garages.show', {garage: id})).data;

const getGarage = (id) => {
    const { data, isLoading, isError, error,isFetching ,isSuccess } = useQuery({
        queryKey: ['garage'], 
        queryFn: () => fetchOneGarage(id), 
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


const storeGarage = (garage) => (axiosRoute.post('garages.store', null, garage));

const updateGarage = (garage) => (axiosRoute.put('garages.update', garage.id, garage));

//store CREATE - UPDATE 
const createEditGarage = (formikErrors,garage) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    const createEditGarageMutation = useMutation({
        mutationFn: (garage.id == '' ?  storeGarage : updateGarage),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'name': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['garages']);      
            navigation.navigate('GarageList',{ level: 'success',  flashMessage: data?.data?.message , page: 1}); 
        },
    });
    return createEditGarageMutation;
}

//BRANCH SECTION
const storeBranch = (branch) => (axiosRoute.post('branches.store', null, branch));

const updateBranch = (branch) => (axiosRoute.patch('branches.update', branch.id, branch));

const createEditGarageBranch = (formikErrors,branch) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();
    return useMutation({
        mutationFn: (branch.id == '' ?  storeBranch : updateBranch),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'district_id': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries('garage'); 
            queryClient.invalidateQueries(['branches']); 
            navigation.navigate('DetailGarage',{ level: 'success',  flashMessage: data?.data?.message, id: branch.brancheable_id}); 
        },
    });
}
const destroyBranch = (branch) => axiosRoute.delete('branches.destroy', branch.id);

const deleteGarageBranch = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyBranch,
        
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries(['garage']); 
            queryClient.invalidateQueries(['branches']); 
            navigation.navigate('DetailGarage',{ level: 'success',  flashMessage: data?.data?.message});  
        },
    });
}
//--------------------------------------------------------------
const destroyGarage = (garage) => axiosRoute.delete('garages.destroy', garage.id);

const deleteGarage = () => {

    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    const deleteGarageMutation = useMutation({
        mutationFn: destroyGarage,
        
        onError: (error) => {
            console.log(error.response.data.message);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries(['garages',1]); 
            navigation.navigate('GarageList',{ level: 'success',  flashMessage: data?.data?.message, page: 1}); 
            //navigation.navigate('BrandList',{ level: 'success', flashMessage: data?.data?.message }); asi en un futuro
        },
    });
    return deleteGarageMutation;
}

export {getGarages , getGarage, createEditGarage ,createEditGarageBranch, deleteGarageBranch ,deleteGarage};