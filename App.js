import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import CustomToast from './src/components/CustomToast';
import "./src/css/global.css";
import Root from './Root';

export default function App() {

  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
