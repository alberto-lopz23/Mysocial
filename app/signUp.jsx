import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import BackButtom from '../components/BackButtom'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { wp, hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import Icon from '../assets/icons'
import Buttom from '../components/Button'

// Firebase
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const SignUp = () => {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Revisar si ya hay usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace('/home')
    })
    return () => unsubscribe()
  }, [])

  const onRegister = async () => {
    if (!username || !email || !password) {
      alert("Por favor, llena todos los campos")
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // actualizar perfil con el username
      await updateProfile(user, { displayName: username })

      console.log("Usuario registrado:", user)
      alert("¡Registro exitoso!")
      router.replace('/home') // manda al home y evita volver atrás al registro
    } catch (error) {
      console.error("Error al registrar:", error.message)

      // Manejar caso de email ya registrado
      if (error.code === "auth/email-already-in-use") {
        alert("Este email ya está registrado. Intenta iniciar sesión.")
      } else {
        alert("Error: " + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper>
      <StatusBar style='dark' />
      <View style={styles.container}>
        <BackButtom router={router} />

        {/* welcome */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Input 
            icon={<Icon name="iconUser" size={26} />}
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
          />
          <Input
            icon={<Icon name="iconMail" size={26} />}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
          />
          <Input
            icon={<Icon name="iconLock" size={26} />}
            placeholder='Password'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Buttom title={'Register'} loading={loading} onPress={onRegister}/>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Have account?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={[styles.singUpText, { color: theme.Colors.primary, fontWeight: theme.font.bold }]}>
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingHorizontal: wp(5),
    paddingTop: hp(8), 
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  welcome: {
    marginBottom: hp(5), 
  },
  welcomeText: {
    color: theme.Colors.text,
    fontSize: hp(5),
    fontWeight: theme.font.bold,
    textAlign: 'left',
  },
  form: {
    width: '100%', 
    gap: 20,
    marginBottom: hp(5),
  },
  footer: {
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 'auto',
  },
  footerText: {
    color: theme.Colors.text,
    fontSize: hp(2.5),
  },
  singUpText: {
    textAlign: 'center',
    color: theme.Colors.text,
    fontSize: hp(4),
  },
})

export default SignUp
