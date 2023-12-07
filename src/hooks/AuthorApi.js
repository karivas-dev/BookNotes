import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchAuthors = async (page) => (await axiosRoute.get('authors.index', { page: page})).data;
const getAuthors = (page) => {
    const [authors, setAuthors] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['authors', page],
        queryFn: () => fetchAuthors(page), 
        onError: (error) => {console.log(error);},
        onSuccess:(data) => {setAuthors(data?.data);},
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , authors}
}

const storeAuthors = (author) => axiosRoute.post('authors.store', null, author);
const createAuthor = (formikErrors, author) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: ( storeAuthors ), 
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'name': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['authors']); 
            navigation.navigate('AuthorsList', { level: 'success',  flashMessage: data?.data?.message, page: 1});
        },
    });
}


export {getAuthors, createAuthor};