import { StatusBar, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme'
import Button from '../components/Button';
import { useRouter } from 'expo-router';



const Welcome = () => {
    const router = useRouter();

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />

            <View style={style.container}>
                {/* Welcome Image */}
                <Image style={style.welcomeImage} resizeMode='contain' source={require('../assets/images/fondoWelcome.jpg')} />

                <View style={{gap: 20}}>
                    {/* Welcome Text */}
                    <Text style={style.title}>Secrets</Text>
                    <Text style={style.textDescription}>
                        The Secrets are waiting for you to discover.
                    </Text>
                </View>

                <View style={style.footer}>

                    {/* Welcome footer */}

                    <Button 
                        title="Get Started"
                        buttonStyle={{marginHorizontal: wp(2), marginTop: wp(10)}}
                       // textStyle={{color: 'red', fontWeight: 'bold'}}
                        onPress={() => router.push('/signUp') }

                    />

                    <View style={ style.buttomText}>
                        <Text style={style.loginText}>
                            Already have an account!
                        </Text>

                        <Pressable onPress={() => router.push('/login')}>
                        <Text style={[style.loginText, {color: theme.Colors.primary, fontWeight: theme.font.bold}]}>
                            Login
                        </Text>
                        </Pressable>
                    </View>
                </View>
                
            </View>
        </ScreenWrapper>


    );
}

export default Welcome;


const style = StyleSheet.create({  

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: wp(0)
    },
    welcomeImage: {
        height: hp(60),
        width: wp(100)
    },
    title: {
        color: theme.Colors.text,
        fontSize: hp(6),
        textAlign: 'center',
        fontWeight: theme.font.extrabold
    },
    textDescription: {
        color: theme.Colors.text,
        fontSize: hp(2.5),
        textAlign: 'center',
        fontWeight: theme.font.semibold
    },
    footer: {
        gap: 30,
        width: '100%'
    },
    buttomText: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    loginText: {
        color: theme.Colors.text,
        fontSize: hp(2.5),
        textAlign: 'center',
        fontWeight: theme.font.semibold
    }
})
