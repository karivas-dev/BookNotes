import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery } from "react-query";

const fetchWishes = async (page) => (await axiosRoute.get('books.index', { page: page})).data;
const getWishes = (page) => {
    const [wishes, setWishes] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['wishes', page],
        queryFn: () => fetchWishes(page), 
        onError: (error) => {console.log(error);},
        onSuccess:(data) => {setWishes(data?.data);},
        refetchOnWindowFocus:false
    });
    
    return {data, isLoading, isError, isFetching, error , wishes}
}

export {getWishes};