import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchModels = async (page,brandId) => (await axiosRoute.get('models.index', { brand:brandId , page: page})).data;

const getModelsByBrand = (page,brandId) => {
    const [models,setModels] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['models',page],
        queryFn: () => fetchModels(page,brandId), 
        onError: (error) => {
            console.log(error);
        },
        onSuccess:(data) => {
            if(data?.meta?.current_page === 1){
                setModels(data?.data);
            }else{
                setModels([...models, ...data?.data]);
            }
        },
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , models}
}

const fethcOneModel =  async(id) => (await axiosRoute.get('models.show', id)).data;

const getModel = (id) => {
    const { data, isLoading, isError, error,isFetching ,isSuccess } = useQuery({
        queryKey: ['model'], 
        queryFn: () => fethcOneModel(id), 
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

const storeModel = (model) => (axiosRoute.post('models.store', null, model));

const updateModel = (model) => (axiosRoute.patch('models.update', model.id, model));

const createEditModel = (formikErrors, model) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();
    return useMutation({
        mutationFn: (model.id == '' ?  storeModel : updateModel),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'name': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            console.log('guardado');
            queryClient.invalidateQueries('models');//asi funciona porque el page cambia creo xd      
            navigation.navigate('DetailBrand',{ level: 'success', flashMessage: data?.data.message, page: 1, id: model.brand_id}); 
        },
    });
}

const destroyModel = (model) => axiosRoute.delete('models.destroy', model.id);

const deleteModel = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyModel,
        
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries(['models',1]); 
            navigation.navigate('DetailBrand',{ level: 'success',  flashMessage: data?.data?.message, page: 1}); 
            //navigation.navigate('BrandList',{ level: 'success', flashMessage: data?.data?.message }); asi en un futuro
        },
    });
}
export {getModelsByBrand ,getModel ,createEditModel, deleteModel}