import { Text,Pressable } from "react-native";

export const SecondaryButton = ({message , onPress}) => {

    return (
        <Pressable 
            className="px-8 py-2.5 rounded-full
            tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 text-center
            bg-neutral-500 hover:bg-neutral-400 active:bg-neutral-600 focus:bg-gray-400 focus:ring-gray-600"
            onPress={onPress}
        >
           <Text className="font-extrabold text-sm text-gray-200 uppercase text-center">{message}</Text>
        </Pressable>
    );
}