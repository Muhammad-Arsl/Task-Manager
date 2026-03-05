import { ImageBackground, View } from 'react-native';
import lightBg from '../images/bg.png';
import darkBg from '../images/dark-bg-1.png';

export default function ThemedBackground({ children,darkMode }) {
  const backgroundImage = darkMode ? darkBg : lightBg;
 
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {children}
    </ImageBackground>
  );
}