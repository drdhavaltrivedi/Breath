import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

const STAR_COUNT = 100;

const SpaceBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 2000 + 3000,
    })),
    []
  );

  const animatedValues = useMemo(
    () => stars.map(() => new Animated.Value(0)),
    [stars.length]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    animatedValues.forEach((anim, index) => {
      const star = stars[index];
      if (!star) return;
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: star.speed / 2,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: star.speed / 2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [mounted, stars, animatedValues]);

  return (
    <View style={styles.container}>
      {/* Deep space gradient background */}
      <View style={styles.gradient} />
      
      {/* Stars */}
      {stars.map((star, index) => {
        const animatedOpacity = animatedValues[index]?.interpolate({
          inputRange: [0, 1],
          outputRange: [star.opacity * 0.3, star.opacity],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                opacity: animatedOpacity ?? star.opacity,
              },
            ]}
          />
        );
      })}
      
      {/* Nebula effect - subtle colored clouds */}
      <View style={[styles.nebula, styles.nebula1]} />
      <View style={[styles.nebula, styles.nebula2]} />
      <View style={[styles.nebula, styles.nebula3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0e27',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  nebula: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.1,
  },
  nebula1: {
    width: 400,
    height: 400,
    backgroundColor: '#4c1d95',
    top: -100,
    right: -150,
  },
  nebula2: {
    width: 350,
    height: 350,
    backgroundColor: '#1e3a8a',
    bottom: -100,
    left: -100,
  },
  nebula3: {
    width: 300,
    height: 300,
    backgroundColor: '#581c87',
    top: height / 2 - 150,
    left: width / 2 - 150,
  },
});

export default SpaceBackground;
