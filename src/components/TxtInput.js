import { TextInput } from "react-native";

export const TxtInput = ({ placeholder, passEntry , onChangeText, onBlur, value}) => {

    return (
        <TextInput
            className="w-full h-12 px-4 mb-4 bg-[#f2efec] border-blueC-400 
            focus:border-grayC-500 focus:ring-grayC-500 rounded-lg shadow-sm 
            p-2.5 text-black"
            placeholderTextColor="#000"
            placeholder={placeholder}
            secureTextEntry={passEntry}
            onBlur={onBlur}
            onChangeText={onChangeText}
            value={value}
        />
    );
}