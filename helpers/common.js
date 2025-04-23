import { Dimensions } from "react-native";

const {width:deviceWidth, height:deviceHeight} = Dimensions.get('window')

const hp = porcentage=>{
    return (deviceHeight*porcentage)/100;
}

const wp = porcentage=>{
    return (deviceWidth*porcentage)/100;
}

export {hp, wp}
