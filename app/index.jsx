import { useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';

const Index = () => {

  const jokes = [
  // Chistes generales
  "—Oye, ¿cuál es tu plato favorito? —Pues el hondo, porque cabe más comida 😎.",
  "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter 🐦.",
  "—¿Cómo organizan los gatos su fiesta? —¡Miau-sica y ron-ron! 🎉",
  "—Mamá, mamá, ¡en el colegio me llaman distraído! —Niño, tú vives en la luna 🌝.",
  "¿Por qué nadie juega a las cartas en la selva? Porque hay demasiados guepardos 🐆.",

  // Chistes de programación / tech
  "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 = DEC 25 😎",
  "—¿Cuántos programadores hacen falta para cambiar un bombillo? —Ninguno, eso es un problema de hardware.",
  "¿Cuál es el café favorito de un programador? Java ☕",
  "¿Por qué el JavaScript se deprimió? Porque no podía encontrar su 'this' 🥲",
  "Un SQL entra a un bar, se acerca a dos mesas y les pregunta: —¿Puedo JOIN con ustedes? 🧐"
];


  const router = useRouter();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reglas & Términos</Text>

        <Text style={styles.rule}>1. No se permite hate, bullying ni acoso.</Text>
        <Text style={styles.rule}>2. Nada de contenido sexual explícito ni violento.</Text>
        <Text style={styles.rule}>3. Respeta el anonimato: no compartas identidades.</Text>
        <Text style={styles.rule}>4. Los secretos expiran en 24h, no intentes guardarlos.</Text>
        <Text style={styles.rule}>5. El creador puede borrar secretos inapropiados.</Text>
        <Text style={styles.rule}>5. No utilices tus datos personales para registrarte ni en la app</Text>
        

        <Text style={styles.note}>
          Al usar esta app aceptas estas reglas. El incumplimiento puede
          resultar en la expulsión del grupo o bloqueo de tu acceso.
        </Text>

        <View style={styles.joke}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Un chiste para ti:</Text>

          <Text style={{ fontStyle: 'italic', marginTop: 10, display: 'block', }}>
            {jokes[Math.floor(Math.random() * jokes.length)]}
          </Text>
          
        </View>

        <Button title='Aceptar y Entrar' onPress={() => router.push('welcome')} />
      </ScrollView>
    </ScreenWrapper>
  )
}

export default Index;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rule: {
    fontSize: 16,
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 20,
  }
});
