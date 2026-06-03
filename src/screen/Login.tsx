import { View, Text, Image, StyleSheet, ImageBackground, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import showToast from '../utils/ShowToast'
import CustomInput from '../utils/CustomInput'
import CustomButton from '../utils/CustomButton'
import axios from 'axios'
import { useLogin } from '../context/LoginProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCall } from '../const/api'
import { colors } from '../const/Colors'
import { NavigationString } from '../const/NavigationString'
import { getFcmToken } from '../utils/FcmTokenUtils'
import Icon from 'react-native-vector-icons/MaterialIcons'

const { width, height } = Dimensions.get('window')

// Modern color palette - You can easily change these colors
const THEME = {
    primary: '#6366F1',     // Indigo
    primaryDark: '#4F46E5',  // Darker Indigo
    secondary: '#06B6D4',    // Cyan
    accent: '#8B5CF6',       // Purple
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    error: '#EF4444',
}

const Login = ({ navigation, route }: any): React.JSX.Element => {
    const { setIsLoggedIn } = useLogin()
    const [username, setUsername] = useState<string | any>()
    const [password, setPassword] = useState<string | any>()
    const [usernameVal, setUsernameVal] = useState<string | any>()
    const [passwordVal, setPasswordVal] = useState<string | any>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async () => {
        if (!username) {
            setUsernameVal("Email is required")
            return
        }
        if (!password) {
            setPasswordVal("Password is required")
            return
        }
        setIsLoading(true)
        
        const fcmToken = await getFcmToken();
        console.log('📱 FCM Token for Login:', fcmToken);
        
        return await axios.post(`${apiCall.mainUrl}/users/login`, { 
            email: username, 
            password: password,
            fcmToken: fcmToken 
        }).then(async (response) => {
            console.log('✅ Login Token:', response.data.token);
            console.log('FCM Token sent in login request:', fcmToken);

            setIsLoggedIn(true)
            await AsyncStorage.setItem('token', response.data.token);
            showToast(response?.data?.msg || "Login Successfully")
            setTimeout(() => {
                try {
                    navigation.navigate(NavigationString.Drawer, { screen: NavigationString.Profile })
                } catch (e) {
                    navigation.navigate(NavigationString.Profile)
                } finally {
                    setIsLoading(false)
                }
            }, 600)
        }).catch((error: any) => {
            console.log("Error on handleSubmit: ", error);
            console.log("Error response: ", error?.response);
            setIsLoading(false)
            showToast(error?.response?.data?.msg || "Error login. Please try again later.")
        })
    }
    
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar backgroundColor={THEME.primary} barStyle="light-content" />
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section with Gradient Overlay */}
                <View style={styles.heroSection}>
                    <ImageBackground 
                        source={require('../assets/img/login.png')} 
                        style={styles.heroImage}
                        imageStyle={styles.heroImageStyle}
                    >
                        <View style={[styles.overlay, { backgroundColor: 'rgba(99, 102, 241, 0.85)' }]}>
                            <View style={styles.logoContainer}>
                                <Icon name="restaurant" size={60} color={THEME.background} />
                                <Text style={styles.appName}>Medisewa </Text>
                            </View>
                            <Text style={styles.tagline}>Welcome Back!</Text>
                            <Text style={styles.subTagline}>Sign in to continue your culinary journey</Text>
                        </View>
                    </ImageBackground>
                </View>

                {/* Login Form Section */}
                <View style={styles.formSection}>
                    <View style={styles.formContainer}>
                        <Text style={styles.welcomeText}>Hello Again!</Text>
                        <Text style={styles.welcomeSubtext}>We missed you. Please enter your details.</Text>

                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <CustomInput 
                                label="Email Address" 
                                value={username} 
                                autoCapitalize='none' 
                                keyboardType='email-address' 
                                placeholder="Enter your email..." 
                                onChangeText={(e: string) => { setUsername(e); setUsernameVal("") }} 
                                error={usernameVal ? true : false} 
                                errorMessage={usernameVal} 
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
                            <CustomInput 
                                label="Password" 
                                value={password} 
                                placeholder="Enter your password" 
                                onChangeText={(e) => { setPassword(e); setPasswordVal("") }} 
                                isPassword={true} 
                                error={passwordVal ? true : false} 
                                errorMessage={passwordVal} 
                            />
                        </View>

                        {/* Forgot Password Link */}
                        <TouchableOpacity 
                            style={styles.forgotPasswordContainer}
                            onPress={() => navigation.navigate(NavigationString.ForgotPassword)}
                        >
                            <Text style={[styles.forgotPasswordText, { color: THEME.primary }]}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <View style={styles.loginButtonWrapper}>
                            <CustomButton 
                                icon={null} 
                                title="Sign In" 
                                onPress={handleSubmit} 
                                isLoading={isLoading} 
                                backgroundColor={THEME.primary} 
                                textColor={THEME.background} 
                            />
                        </View>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login Buttons */}
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Icon name="google" size={24} color="#DB4437" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Icon name="facebook" size={24} color="#4267B2" />
                                <Text style={styles.socialButtonText}>Facebook</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Register Link */}
                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate(NavigationString.Register)}>
                                <Text style={[styles.registerLink, { color: THEME.primary }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    heroSection: {
        height: height * 0.4,
        width: width,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroImageStyle: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: THEME.background,
        marginTop: 10,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 28,
        fontWeight: 'bold',
        color: THEME.background,
        marginBottom: 8,
        textAlign: 'center',
    },
    subTagline: {
        fontSize: 16,
        color: THEME.background,
        opacity: 0.9,
        textAlign: 'center',
    },
    formSection: {
        flex: 1,
        marginTop: -30,
        backgroundColor: THEME.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
    },
    formContainer: {
        paddingVertical: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: THEME.text,
        marginBottom: 8,
    },
    welcomeSubtext: {
        fontSize: 14,
        color: THEME.textLight,
        marginBottom: 30,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginButtonWrapper: {
        marginBottom: 25,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: THEME.border,
    },
    dividerText: {
        marginHorizontal: 15,
        color: THEME.textLight,
        fontSize: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        gap: 15,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: THEME.border,
        backgroundColor: THEME.background,
        gap: 10,
    },
    socialButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: THEME.text,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    registerText: {
        fontSize: 14,
        color: THEME.textLight,
    },
    registerLink: {
        fontSize: 14,
        fontWeight: 'bold',
    },
})