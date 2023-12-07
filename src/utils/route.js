import route from 'ziggy-js';
import axios from "axios";
import {getAuthToken} from "../context/AuthContext";

const defaultAxios = axios.create({
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
    }
});

let ZiggyData = null;
class axios_routed {
    constructor() {
        this.refreshToken();
    }
    
    async boot() {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/ziggy`);
        ZiggyData = await response.data;
    }

    async refreshToken() {
        defaultAxios.defaults.headers.common['Authorization'] = `Bearer ${await getAuthToken()}`;
    }
    
    ziggyRoute(routeName = null, routeParameters = undefined) {
        return route(routeName, routeParameters, undefined, ZiggyData);
    }

    get(routeName, routeParameters = null, config = undefined) {
        return defaultAxios.get(this.ziggyRoute(routeName, routeParameters), config);
    }

    delete(routeName, routeParameters = null, config = undefined) {
        return defaultAxios.delete(this.ziggyRoute(routeName, routeParameters), config)
    }

    post(routeName, routeParameters = null, data = undefined, config = undefined) {
        return defaultAxios.post(this.ziggyRoute(routeName, routeParameters), data, config);
    }

    put(routeName, routeParameters = null, data = undefined, config = undefined) {
        return defaultAxios.put(this.ziggyRoute(routeName, routeParameters), data, config);
    }

    patch(routeName, routeParameters = null, data = undefined, config = undefined) {
        return defaultAxios.patch(this.ziggyRoute(routeName, routeParameters), data, config);
    }

    postForm(routeName, routeParameters = null, data = undefined, config = undefined) {
        return defaultAxios.postForm(this.ziggyRoute(routeName, routeParameters), data, config)
    }

    putForm(routeName, routeParameters = null, data = undefined, config = undefined) {
        return defaultAxios.putForm(this.ziggyRoute(routeName, routeParameters), data, config)
    }

    patchForm(routeName, routeParameters = null, data = undefined, config = undefined) {
        return defaultAxios.patchForm(this.ziggyRoute(routeName, routeParameters), data, config)
    }
}

const axiosRoute = Object.freeze(new axios_routed());
export default axiosRoute;