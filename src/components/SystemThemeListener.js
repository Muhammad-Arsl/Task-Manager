import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../redux/themeSlice';

export default function SystemThemeListener() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.theme);
  useEffect(() => {
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(setDarkMode(colorScheme === 'dark'));
    });

    return () => subscription.remove(); // cleanup on unmount
  }, [dispatch]);

  return null; // nothing to render
}