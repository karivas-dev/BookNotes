import { View, Text } from "react-native";


export const Messages = ({level,message}) => {
   
    if(level == 'error'){
        return (
            <View className="max-w-sm p-5 bg-[#d36661] rounded-lg mt-2">
                <Text className="text-gray-200 font-bold">¡Ups! Hay un error</Text>
                <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }else if (level == 'success'){
        return (
            <View className="max-w-sm p-5 bg-[#6eb071] rounded-lg mt-2">
                <Text className="text-gray-200 font-bold">Todo marcha ¡bien!</Text>
                <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }else if (level == 'warning'){
        return (
            <View className="max-w-sm p-5 bg-orange-500 rounded-lg mt-2">
               <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }else if (level == 'info'){
        return (
            <View className="max-w-sm p-5 bg-[#8881a8] rounded-lg mt-2">
                <Text className="text-gray-200 font-bold">Debes saber que...</Text>
               <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }
   
}