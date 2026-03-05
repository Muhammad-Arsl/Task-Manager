import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../constants/ThemeColors';

export default function useTheme() {
  const darkMode = useSelector(state => state.theme.darkMode);
    
  // Return the proper theme object 
  return darkMode ? darkTheme : lightTheme;
}