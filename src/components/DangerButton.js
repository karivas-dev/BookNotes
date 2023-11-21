import { Text,Pressable } from "react-native";

export const DangerButton = ({message , onPress}) => {

    return (
        <Pressable 
            className="px-8 py-2.5 rounded-full 
            tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 text-center
            bg-red-500 hover:bg-red-800 active:bg-red-800 focus:bg-red-800 focus:ring-red-800"
            onPress={onPress}
        >
           <Text className="font-extrabold text-sm text-gray-200 uppercase text-center">{message}</Text>
        </Pressable>
    );
}