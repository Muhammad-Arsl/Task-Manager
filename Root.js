import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDarkMode } from './src/redux/themeSlice';
import AppNavigator from './src/navigation/AppNavigator';
import CustomToast from './src/components/CustomToast';
import { Alert, Appearance, useColorScheme } from 'react-native';
import SystemThemeListener from './src/components/SystemThemeListener';

export default function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme !== null) {
          dispatch(setDarkMode(JSON.parse(savedTheme)));
        } else {
          // If no preference, use system theme
          const colorScheme = Appearance.getColorScheme();
          dispatch(setDarkMode(colorScheme === 'dark'));
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <SystemThemeListener />
      <AppNavigator />
      <CustomToast />
    </NavigationContainer>
  );
}