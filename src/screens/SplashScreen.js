import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ImageBackground } from 'react-native';
import Logo from "../images/logo.png";
import splashBg from "../images/splash-bg.png";

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <ImageBackground
            source={splashBg}
            resizeMode="cover"
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6B3FA0" />
                {/* <Image source={Logo} style={{ width: 180, height: 180 }} />
                <Text style={styles.title}>Task Flow</Text>
                <Text className="text-gray-600 text-md">Your Daily Task Partner!</Text> */}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:100,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        // marginBottom: 20,
        color: '#6B3FA0',
    },
});

export default SplashScreen;
