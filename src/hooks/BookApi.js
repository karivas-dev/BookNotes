import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchBooks  = async (page) => (await axiosRoute.get('books.index', { page: page})).data;
const getBooks = (page) => {
    const [ books, setBooks ] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['books', page],
        queryFn: () => fetchBooks(page),
        onError: (error) => {console.log(error);},
        onSuccess:(data) => {setBooks(data?.data);},
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , books}
}

const fetchBook = async (id) => (await axiosRoute.get('books.show', {book: id})).data;
const getBook = (id) => {
    const { data:book, isLoading, isError, error,isFetching ,isSuccess } = useQuery({
        queryKey: ['book'], 
        queryFn: () => fetchBook(id),
        refetchOnWindowFocus:false
    }); 

    return { data:book, isLoading, isError, error, isFetching , isSuccess}
}

const storeBook = (book) => axiosRoute.post('books.store', null, book);
const updateBook = (book) => (axiosRoute.put('books.update', book.id, book));

const createEditBook = (formikErrors, book) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: (book.id == '' ? storeBook : updateBook), 
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'title': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['books']); 
            navigation.navigate('HomePage', { level: 'success',  flashMessage: data?.data?.message, page: 1});
        },
    });
}

export {getBook, getBooks, createEditBook};
