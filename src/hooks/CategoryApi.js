import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchCategories = async (page) => (await axiosRoute.get('categories.index', { page: page})).data;
const getCategories = (page) => {
    const [categories, setCategories] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['categories', page],
        queryFn: () => fetchCategories(page), 
        onError: (error) => {console.log(error);},
        onSuccess:(data) => {setCategories(data?.data);},
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , categories}
}

const storeCategories = (category) => axiosRoute.post('categories.store', null, category);
const createCategory = (formikErrors, category) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: ( storeCategories ), 
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'name': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['categories']); 
            navigation.navigate('CategoriesList', { level: 'success',  flashMessage: data?.data?.message, page: 1});
        },
    });
}


export {getCategories, createCategory};