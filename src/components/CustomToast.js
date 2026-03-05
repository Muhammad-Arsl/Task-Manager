import { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/toastSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CustomToast = () => {
    const { visible, message, type } = useSelector((state) => state.toast);
    const dispatch = useDispatch();
    const translateY = useSharedValue(-100);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(50);
            const timer = setTimeout(() => {
                handleDismiss();
            }, 3000);
            return () => clearTimeout(timer);   
        } else {
            translateY.value = withTiming(-100);
        }
    }, [visible]);

    const handleDismiss = () => {
        // Define the JS-side function to handle the dispatch
        const dispatchHide = () => {
            dispatch(hideToast());
        };

        translateY.value = withTiming(-100, {}, (finished) => {
            if (finished) {
                runOnJS(dispatchHide)();
            }
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    if (!visible && translateY.value === -100) return null;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-[#1a1a1a]',
                    border: 'border-[#4caf50]',
                    icon: <CheckCircle2 size={24} color="#4caf50" />,
                    textColor: 'text-white'
                };
            case 'error':
                return {
                    bg: 'bg-[#1a1a1a]',
                    border: 'border-[#f44336]',
                    icon: <AlertCircle size={24} color="#f44336" />,
                    textColor: 'text-white'
                };
            default:
                return {
                    bg: 'bg-[#1a1a1a]',
                    border: 'border-[#f49b33]',
                    icon: <Info size={24} color="#f49b33" />,
                    textColor: 'text-white'
                };
        }
    };

    const styles = getToastStyles();

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 20,
                    right: 20,
                    zIndex: 9999,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                    width: width - 40
                },
                animatedStyle
            ]}
        >
            <View className={`${styles.bg} ${styles.border} flex-row items-center rounded-2xl border-l-[6px] p-4`}>
                <View className="mr-3">
                    {styles.icon}
                </View>
                <Text className={`${styles.textColor} flex-1 text-sm font-medium`}>
                    {message}
                </Text>
            </View>
        </Animated.View>
    );
};

export default CustomToast;
