import { View, Text } from "react-native";


export const Messages = ({level,message}) => {
   
    if(level == 'error'){
        return (
            <View className="max-w-sm p-6 bg-red-500 rounded-lg mt-2">
                <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }else if (level == 'success'){
        return (
            <View className="max-w-sm p-6 bg-emerald-500 rounded-lg mt-2">
                <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }else if (level == 'warning'){
        return (
            <View className="max-w-sm p-6 bg-orange-500 rounded-lg mt-2">
               <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }else if (level == 'info'){
        return (
            <View className="max-w-sm p-6 bg-slate-700 rounded-lg mt-2">
               <Text className="text-gray-200">{message}</Text>
            </View>
        )
    }
   
}