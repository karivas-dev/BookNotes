import { Text,Pressable } from "react-native";

export const PrimaryButton = ({message,onPress}) => {
    
    return (
        <Pressable 
            className="px-8 py-2.5 rounded-full tracking-widest transition ease-in-out 
            duration-150 text-center bg-[#e75963] hover:bg-[#ff6262]
             active:bg-[#e75963]"
            onPress={onPress}
        >
            <Text className="font-extrabold text-sm text-gray-200 uppercase text-center">{message}</Text>
        </Pressable>
    );
}
