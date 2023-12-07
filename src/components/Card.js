import { View } from "react-native"

export const Card = (props) => {

    return (
        <View className="block max-w-sm p-3 rounded-lg bg-[#b2aba3] mt-1.5">
            {props.children}
        </View>
    )
}