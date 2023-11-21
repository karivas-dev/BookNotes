import axiosRoute from "../utils/route";
import { useEffect, useState } from "react";
import { useQuery, useMutation , useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";

const storeBidReplacement = (bid) => (axiosRoute.post('bidreplacement.store', null, bid));

export const createEditBidReplacement = (formikErrors ,bid_replacement) => {
    const queryClient = new useQueryClient();
    const navigation = useNavigation();
    return useMutation({
        mutationFn: (storeBidReplacement ),
        
        onError: (error) => {
            const erno = error.response.data.errors != null ? error.response.data.errors : {'bid_id': error.response.data.message};
            formikErrors(erno);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['bid']); 
            navigation.navigate('DetailTicketBid',{ level: 'success',  flashMessage: data?.data?.message, id: bid_replacement.id}); 
        },
    });
}

const fetchReplacements = async () => (await axiosRoute.get('inventories.index')).data;
export const getBidReplacements = () => {
    const [allData, setAllData] = useState([]); // Estado para almacenar todos los datos
    useEffect(() => {
        async function fetchData() {
            const data = await  fetchReplacements();
            let allDataArray = [];
            if(data.data.length == 0 ){
                setAllData([{id:'', name:'No Replacements in our records'}]);
            }
            else{
                const formattedData = data.data.map(inventory => ({ id: inventory.id, name: (inventory.replacement.name + ', ' + inventory.store), 
                    replacement_id: inventory.replacement.id, price: inventory.unit_price})
                );
                allDataArray = [...allDataArray, ...formattedData];
                setAllData(allDataArray);
            }
        }
        fetchData();

    }, []);
    useEffect(() => {
        console.log(allData);
    }, [allData]);
    return allData;
}