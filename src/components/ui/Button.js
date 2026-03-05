import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import useTheme from '../../hooks/useTheme';

const Button = ({
  onPress,
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  textClassName = '',
}) => {
  const theme = useTheme();

  const variants = {
    primary: '',
    secondary: 'border',
    danger: 'bg-red-500',
    outline: 'bg-transparent border',
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.buttonPrimary,
      borderColor: theme.primary,
    },
    secondary: {
      backgroundColor: theme.bgMuted,
      borderColor: theme.inputBorder,
    },
    danger: {
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.primary,
    },
  };

  const textColors = {
    primary: 'text-white',
    secondary: '',
    danger: 'text-white',
    outline: '',
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.primary;
    if (variant === 'secondary') return theme.text;
    return '#fff';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={variantStyles[variant]}
      className={`flex-row items-center justify-center rounded-2xl p-4 gap-3  ${variants[variant]} ${disabled || loading ? 'opacity-70' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View className="flex-row items-center justify-center gap-3">
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;