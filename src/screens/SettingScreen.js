import { View, Text, TouchableOpacity, ImageBackground, Switch } from 'react-native'
import { ChevronLeft, LogOut, Settings, Sun } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../services/firebase'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toggleDarkMode } from '../redux/themeSlice';
import { useEffect } from 'react';
import ThemeBackground from '../components/ThemeBackground';
import { darkPrimary, darkTheme, lightPrimary, lightTheme } from '../constants/ThemeColors';
import { StatusBar } from 'expo-status-bar';
import useTheme from '../hooks/useTheme';

export default function SettingScreen({ navigation }) {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    AsyncStorage.setItem('themeMode', JSON.stringify(darkMode));
  }, [darkMode]);


  const handleDarkMode = () => {
    dispatch(toggleDarkMode());
  }

  const handleLogout = () => {
    auth.signOut()
    navigation.navigate('Login')
  }
  return (
    <ThemeBackground darkMode={darkMode}>
      <SafeAreaView className="flex-1 p-4">
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <View className="flex flex-row justify-between items-center gap-2 border-b border-[#fff]/10 pb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color={darkMode ? darkTheme.text : lightTheme.text} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <Settings size={28} color={darkMode ? darkTheme.text : lightTheme.text} />
            <Text style={{ color: darkMode ? darkTheme.text : lightTheme.text }} className={`text-[1.5rem] font-semibold`}>Settings</Text>
          </View>
          <View className="w-10"></View>
        </View>
        <View className="flex-1 pt-10">
          <TouchableOpacity style={{ backgroundColor: theme.inputBg }}
            onPress={handleDarkMode}
            className="mb-4 flex-row gap-3 items-center rounded-2xl h-14 p-4 backdrop-blur-md">
            <Sun size={28} color="#f49b33" />
            <Text style={{ color: darkMode ? darkTheme.text : lightTheme.text }} className="text-lg font-semibold">Dark Mode</Text>
            <View className="flex-1">
              <Switch thumbColor={`${darkMode ? '#f49b33' : '#fff'}`} value={darkMode} onValueChange={handleDarkMode} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: theme.inputBg }} onPress={handleLogout} className={`mb-4 flex-row gap-3 items-center rounded-2xl h-14 p-4 backdrop-blur-md`}>
            <LogOut size={28} color="red" />
            <Text style={{ color: darkMode ? darkTheme.text : lightTheme.text }} className="text-lg font-semibold">Logout</Text>
          </TouchableOpacity>


        </View>
      </SafeAreaView>
    </ThemeBackground>
  )
}