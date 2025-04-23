import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'


const BackButtom = ({size=30, router}) => {
  return (
    <Pressable onPress={()=> router.back()} style={styles.buttom}>
      <Icon name='iconArrowLeft' size={size} color={theme.Colors.primary} />
    </Pressable>
  )
}

export default BackButtom


const styles = StyleSheet.create({
  buttom: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: theme.Colors.primary,
    borderRadius: 20,
    padding: 10,
  }
})