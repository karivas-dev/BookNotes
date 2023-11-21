import {useMutation, useQuery, useQueryClient} from "react-query";
import axiosRoute from "../utils/route";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";


//Brand.index
const fetchBrands = async (page) =>  (await axiosRoute.get('brands.index', {page: page})).data;

const getBrands = (page) => {
    const [brands,setBrands] = useState([]);
    const { data, isLoading, isError, isFetching, error } = useQuery({
        //queryKey: 'brands', /* ['brands',page] */
        queryKey: ['brands',page],
        queryFn: () => fetchBrands(page),
        onSuccess:(data) => setBrands(data?.data),
        refetchOnWindowFocus:false
    });
    return {data, isLoading, isError, isFetching, error , brands}

}

//Brand.show
const fetchOneBrand = async (id) => (await axiosRoute.get('brands.show', {brand: id})).data;

const getBrand = (id) => {
    const { data:brand, isLoading, isError, error,isFetching ,isSuccess } = useQuery({
        queryKey: ['brand'], 
        queryFn: () => fetchOneBrand(id),
        refetchOnWindowFocus:false
    });

    return { data:brand, isLoading, isError, error, isFetching , isSuccess}
}

//Brand.store
const storeBrand = (brand) => (axiosRoute.post('brands.store', null, brand));

//Brand.update
const updateBrand = (brand) => (axiosRoute.put('brands.update', brand.id, brand));

//Brand CREATE - UPDATE 
const createEditBrand = (formikErrors, brand) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: (brand.id == '' ? storeBrand : updateBrand),

        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'name': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['brands']);
            navigation.navigate('BrandsList',{ level: 'success',  flashMessage: data?.data?.message , page: 1}); 
        },
    });
}

//Brand.delete
const destroyBrand = (brand) => axiosRoute.delete('brands.destroy', brand.id);

const deleteBrand = () => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();

    return useMutation({
        mutationFn: destroyBrand,

        onSuccess: (data) => {
            console.log('eliminado');
            queryClient.invalidateQueries(['brands']);
            navigation.navigate('BrandsList',{ level: 'success',  flashMessage: 'La marca se elimino correctamente.'}); 
        },
    });
}

export { getBrands , getBrand, createEditBrand, deleteBrand};