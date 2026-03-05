import { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export const useLogoAnimation = () => {
  const height = Dimensions.get("window").height;

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -translateY.value }],
    opacity: opacity.value,
  }));

  const startAnimation = () => {
    translateY.value = withTiming(height / 2 - 440, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });

    opacity.value = withTiming(1, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const resetAnimation = () => {
    translateY.value = height;
    opacity.value = 0;
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return {
    animatedStyles,
    startAnimation,
    resetAnimation,
  };
};