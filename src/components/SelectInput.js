import React from "react";
import {Picker} from "@react-native-picker/picker";

export const SelectInput = ({ data, DefaultPlaceholder,onValueChange,selectedValue ,onBlur}) => {

    return (
        <Picker
            className="w-full h-12 px-4 mb-4 bg-[#e75963] border-transparent
             focus:bg-[#e75963] focus:ring-[#e75963]
           rounded shadow-sm p-2.5 text-gray-200"
           onValueChange={onValueChange}
           selectedValue={selectedValue}
           onBlur={onBlur}
        >
            {DefaultPlaceholder && (
                <Picker.Item
                    label={DefaultPlaceholder}
                    value=""
                />
            )}
            {
                data.map((object, index) => {
                    return (
                        <Picker.Item
                            key={index}
                            label={object.name}
                            value={object.id}
                        />
                    )
                })
            }
        </Picker>
    )
}
