import axiosRoute from "../utils/route";
import { useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const fetchBranches = async (page,branchId) => (await axiosRoute.get('branches.index', { branch:branchId , page: page})).data;

const fetchOneBranch =  async(id) => (await axiosRoute.get('branches.show', id)).data;

const getBranches = (page) => {
    const [branches,setBranches] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['branches',page],
        queryFn: () => fetchBranches(page), 
        onError: (error) => {
            console.log(error);
        },
        onSuccess:(data) => {
            setBranches(data?.data);
        },
        refetchOnWindowFocus:false
    });
    return {data, isLoading, isError, isFetching, error , branches}

}

const getBranch = (id) => {
    const { data, isLoading, isError, error,isFetching ,isSuccess } = useQuery({
        queryKey: ['branch'], 
        queryFn: () => fetchOneBranch(id), 
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

const storeBranch = (branch) => (axiosRoute.post('branches.store', null, branch));

const updateBranch = (branch) => (axiosRoute.patch('branches.update', branch.id, branch));

const createEditBranch = (formikErrors,branch) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();
    return useMutation({
        mutationFn: (branch.id == '' ?  storeBranch : updateBranch),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'district_id': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['branches']); 
            navigation.navigate('Home', {
                screen: 'BranchesList',
                params: {level: 'success', flashMessage: data?.data?.message, page: 1}
            });
        },
    });
}

const destroyBranch = (branch) => axiosRoute.delete('branches.destroy', branch.id);

const deleteBranch = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyBranch,
        
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries(['branches']); 
            navigation.navigate('Home',{screen: 'BranchesList', params: { level: 'success',  flashMessage: data?.data?.message, page:1 }}); 
        },
    });
}
export {getBranches ,getBranch ,createEditBranch, deleteBranch}