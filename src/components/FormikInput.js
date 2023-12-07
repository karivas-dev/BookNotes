import {Text, TextInput, View} from "react-native";
import React from "react";

export const FormikInput = ({ placeholder, multiline,rows,passEntry, label = null, formik, valueName}) => {

    return (
        <View className="mb-4">
            { label == null ? null :
                <Text className="text-gray-200">{ label }</Text>
            }
            <TextInput
                className="w-full h-12 px-4 bg-[#f2efec] focus:border-[#f2efec] focus:ring-[#f2efec]
                rounded-lg shadow-sm p-2.5 text-black"
                placeholderTextColor="#000"
                placeholder={placeholder}
                secureTextEntry={passEntry}
                multiline={multiline}
                numberOfLines={rows}
                onChangeText={formik.handleChange(valueName)}
                value={formik.values[valueName]}
            />
            <Text className="text-orange-600">
                { formik.touched?.[valueName] && formik.errors?.[valueName] }
            </Text>
        </View>
    );
}