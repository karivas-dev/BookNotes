import axiosRoute from "../utils/route";
import {useEffect, useState} from "react";

const fetchLocation = async () => (await axiosRoute.get('location')).data;

let locationData = null;

export default function getLocation() {
    const [location, setLocation] = useState(locationData);

    useEffect(() => {
        async function fetchData() {
            if (location == null) {
                const data = await fetchLocation();
                setLocation(data);
                locationData = data;
            }
        }
        fetchData();
    }, []);
    return location;
}