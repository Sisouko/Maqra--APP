import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

export function useReadingTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (isActive) return;
    setIsActive(true);
    
    // Trigger success haptic on session start
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.log('Haptics not supported in this environment', e);
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (!isActive) return;
    setIsActive(false);
    
    // Trigger medium impact haptic on pause
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.log('Haptics not supported in this environment', e);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    
    // Trigger warning haptic on stop
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {
      console.log('Haptics not supported in this environment', e);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const elapsedSeconds = seconds;
    setSeconds(0);
    return elapsedSeconds;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    seconds,
    isActive,
    startTimer,
    pauseTimer,
    stopTimer,
  };
}
