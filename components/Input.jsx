import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { TextInput } from 'react-native-gesture-handler'

const Input = (props) => {
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      {
        props.icon && props.icon
      }
      <TextInput 
        style={{flex: 1, color: theme.Colors.text,  ...props.style}}
        placeholderTextColor={props.placeholderTextColor}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
      
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    height: wp(12),
    borderWidth: 0.8,
    borderColor: theme.Colors.text,
    borderCurve: theme.radius.xxl,
    paddingHorizontal: 18,
    },
    textInput: {
      flex: 1,
      color: theme.Colors.text,
      fontSize: wp(4),
      fontFamily: theme.font.regular,

    }
})