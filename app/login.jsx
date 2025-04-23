import { StyleSheet, Text, Pressable, View } from 'react-native'
import React, { useRef } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import BackButtom from '../components/BackButtom'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { wp, hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import Icon from '../assets/icons'
import { useState } from 'react'
import Buttom from '../components/Button'


const login = () => {
  const router = useRouter();
  const emailRef = useRef("")
  const passwordRef = useRef("")

  const [loading, setLoading] = useState(false)

  const onsubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/')
    }, 2000)
  }


  return (
    <ScreenWrapper>
      <StatusBar style='dark' />
      <View style={styles.container}>
        <BackButtom router={router} />

        { /* welcome back*/}
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        { /* form*/}

        <View style={styles.form}>
          <Input
            icon={<Icon name="iconMail" size={26} />}
            placeholder='Email'
            onChangeText={value => emailRef.current = value}
          />
          <Input
            icon={<Icon name="iconLock" size={26} />}
            placeholder='Password'
            secureTextEntry
            onChangeText={value => emailRef.current = value}
          />

          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          <Buttom title={'Login'} loading={loading} onPress={onsubmit} />

        </View>

        { /* footer */}
        <View style={styles.footer}>
          <View style={{ flex: 1, height: 1 }}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>
          </View>

          <Pressable onPress={() => router.push('/singUp')}>
            <Text style={[styles.singUpText, { color: theme.Colors.primary, fontWeight: theme.font.bold,}]}>
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}


export default login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 45,
    paddingHorizontal: wp(5)
  },
  welcome: {
    flexDirection: 'column',
    textAlign: 'left',
    gap: 10
  },
  welcomeText: {
    color: theme.Colors.text,
    fontSize: hp(3),
    fontWeight: theme.font.bold
  },
  form: {
    gap: 25
  },
  forgotPassword: {
    color: theme.Colors.text,
    fontSize: hp(1.5),
    textAlign: 'right',
    fontWeight: theme.font.semibold
  },
  footer: {
    flexDirection: 'colum',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  singUpText: {
    textAlign: 'center',
    color: theme.Colors.text,
    fontSize: hp(3)
  }
})