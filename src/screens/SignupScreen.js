import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../redux/authSlice';
import { showToast } from '../redux/toastSlice';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Mail, Lock, UserPlus, EyeOff, Eye } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useLogoAnimation } from '../hooks/useLogoAnimation';
import ThemedBackground from '../components/ThemeBackground';
import useTheme from '../hooks/useTheme';
const SignupScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const { darkMode } = useSelector(state => state.theme);
  const theme = useTheme();
  const handleSignup = async () => {
    if (!email || !password) {
      dispatch(showToast({ message: 'Please enter email and password', type: 'error' }));
      return;
    }

    if (password.length < 6) {
      dispatch(showToast({ message: 'Password should be at least 6 characters', type: 'error' }));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch(setUser({
        email: user.email,
        id: user.uid
      }));

      dispatch(setLoading(false));
      dispatch(showToast({ message: 'Account created successfully!', type: 'success' }));
      navigation.replace('TaskList');
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = error.message.includes('auth/email-already-in-use')
        ? 'This email is already registered'
        : error.message || 'Failed to sign up';

      dispatch(setError(errorMessage));
      dispatch(showToast({ message: errorMessage, type: 'error' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { animatedStyles, resetAnimation, startAnimation } = useLogoAnimation();

  const handleRefresh = () => {
    setRefreshing(true);
    resetAnimation();
    setTimeout(() => {
      setRefreshing(false);
      startAnimation();
    }, 100);
  };


  return (
    <ThemedBackground darkMode={darkMode}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={'#4f23ab'} />
          }
          contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center justify-center p-6">
            {/* Logo Section */}
            <View className="items-center">
              <Animated.View style={animatedStyles}>
                <View>
                  <Image
                    source={require('../images/logo-final.png')}
                    className="h-[200px] w-[250px]"
                    resizeMode="cover"
                  />
                </View>
              </Animated.View>

            </View>
            <View className="mb-3">
                <Text style={{ color: theme.text }} className="mt-1 text-md capitalize tracking-widest">Please fill out the form to sign up </Text>
            </View>
            {/* Form Section */}
            <View className="w-full">
              <View className="space-y-4">
                <View style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }} className="flex-row items-center rounded-2xl border px-4 py-1 backdrop-blur-lg">
                  <Mail size={20} color={theme.primary} />
                  <TextInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 px-3 py-3"
                    placeholderTextColor={theme.muted}
                    style={{ color: theme.text }}
                  />
                </View>

                <View style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }} className="flex-row items-center rounded-2xl border px-4 py-1 backdrop-blur-lg mt-5">
                  <Lock size={20} color={theme.primary} />
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="flex-1 px-3 py-3"
                    placeholderTextColor={theme.muted}
                    style={{ color: theme.text }}
                  />
                  {
                    showPassword ? (
                      <Eye onPress={togglePasswordVisibility} size={20} color="#4f23ab" />
                    ) : <EyeOff onPress={togglePasswordVisibility} size={20} color="#666" />
                  }
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                className={`mt-8 flex-row items-center justify-center rounded-2xl bg-[#4f23ab] p-4 shadow-lg ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <UserPlus size={20} color="#fff" />
                    <Text className="ml-2 text-center text-lg font-bold text-white">
                      Register
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer / Extra Section */}
            <View className="mt-10">
              <TouchableOpacity className="flex-row items-center justify-center" onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: theme.muted }} className="text-sm">
                  Already have an account? </Text>
                <Text style={{ color: theme.text }} className="font-semibold]">Sign In </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedBackground>
  );
};

export default SignupScreen;
