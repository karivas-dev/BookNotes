import axiosRoute from "../utils/route";
import { useEffect, useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

//Piker Models
const fetchModels = async (page,brandId) => (await axiosRoute.get('models.index', { brand:brandId , page: page})).data;
const getSelectModels = (brandId) => {
    const [allData, setAllData] = useState([]); // Estado para almacenar todos los datos
    useEffect(() => {
        async function fetchData() {
            if (brandId != '') {
                const data = await fetchModels(1,brandId);
                let allDataArray = [];
                if(data.data.length == 0 ){
                    setAllData([{id:'', name:'No models for this brand'}]);
                }
                else{
                    for (let page = 1; page <= data.meta?.last_page; page++) {
                        const response = await fetchModels(page,brandId);
                        allDataArray = [...allDataArray, ...response.data];
                    }
                    setAllData(allDataArray);
                }
            }
        }
        fetchData();
    }, [brandId]);
    return allData;
}

const fetchReplacements = async (page) => (await axiosRoute.get('replacements.index', { page: page})).data;

const getReplacements = (page) => {
    const [replacements,setReplacements] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['replacements',page],
        queryFn: () => fetchReplacements(page), 
        onError: (error) => {
            console.log(error);
        },
        onSuccess:(data) => {
            if(data?.meta?.current_page === 1){
                setReplacements(data?.data);
            }else{
                setReplacements([...replacements, ...data?.data]);
            }
        },
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , replacements}
}




const fetchOneReplacement =  async(id) => (await axiosRoute.get('replacements.show', id)).data;

const getReplacement = (id) => {
    const { data, isLoading, isError, error, isFetching ,isSuccess } = useQuery({
        queryKey: ['replacement'], 
        queryFn: () => fetchOneReplacement(id), 
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


const storeReplacement = (replacement) => (axiosRoute.post('replacements.store', null, replacement));

const updateReplacement = (replacement) => (axiosRoute.put('replacements.update', replacement.id, replacement));

const createEditReplacement = (formikErrors, replacement) => {

    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    const createEditReplacementMutation = useMutation({
        mutationFn: (replacement.id == '' ?  storeReplacement : updateReplacement),

        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'model_id': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            console.log('guardado');
            queryClient.invalidateQueries('replacements');
            navigation.navigate('ReplacementsList', { level: 'success',  flashMessage: data?.data?.message, page: 1});
},
    });
    return createEditReplacementMutation;
}   

const storeInventory = (inventory) => (axiosRoute.post('inventories.store', null, inventory));

const updateInventory = (inventory) => (axiosRoute.put('inventories.update', inventory.id, inventory));

const createEditInventory = (formikErrors, inventory) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: (inventory.id == '' ?  storeInventory : updateInventory),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'unit_price': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['replacement']); 
            navigation.navigate('DetailReplacement',{ level: 'success',  flashMessage: data?.data?.message}); 
        },
    });
}

const destroyReplacement = (car) => axiosRoute.delete('replacements.destroy', car.id);

const deleteReplacement = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyReplacement,
        
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries('replacements'); 
            navigation.navigate('ReplacementsList', { level: 'success',  flashMessage: data?.data?.message, page: 1});
        },
    });
}

export {getReplacements, getReplacement, deleteReplacement, createEditInventory, createEditReplacement, getSelectModels}