import { Alert, Platform } from 'react-native';

/**
 * Clean and simple notification service compatible with Expo Go.
 * Since Expo Go SDK 53+ has restricted system-level notifications,
 * we use simple but effective feedback for action confirmation.
 */
export const showNotification = (title, body) => {
    return new Promise((resolve) => {
        if (Platform.OS === 'web') {
            alert(`${title}: ${body}`);
            resolve();
        } else {
            // For mobile, Alert is clean, fast, and always works in Expo Go
            Alert.alert(
                title,
                body,
                [{ text: 'OK', onPress: () => resolve() }],
                { cancelable: false }
            );
        }
    });
};
