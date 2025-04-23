import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, bg}) => {
    const {top} = useSafeAreaInsets();
    const paddinTop = top>0? top+5: 30;


    return (
        <View style={{ flex: 1, paddinTop, backgroundColor: bg }}>
            {
                children
            }
        </View>
    )
}


export default ScreenWrapper