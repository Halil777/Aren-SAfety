import React, { useEffect, useMemo } from "react";
import { Dimensions, Platform, View } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Flake = {
  x: number;
  size: number;
  opacity: number;
  speedMs: number;
  drift: number;
  delayMs: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const { width: W, height: H } = Dimensions.get("window");

function SnowFlake({ flake }: { flake: Flake }) {
  const y = useSharedValue(-30);
  const x = useSharedValue(flake.x);

  useEffect(() => {
    // fall
    y.value = withDelay(
      flake.delayMs,
      withRepeat(
        withTiming(H + 30, {
          duration: flake.speedMs,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // gentle drift left-right
    x.value = withDelay(
      flake.delayMs,
      withRepeat(
        withTiming(flake.x + flake.drift, {
          duration: Math.max(1200, flake.speedMs / 2),
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );
  }, [flake, x, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    opacity: flake.opacity,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: flake.size,
          height: flake.size,
          borderRadius: flake.size / 2,
          backgroundColor: "white",
        },
        style,
      ]}
    />
  );
}

export function SnowBackground({
  count = 40,
  opacity = 0.16,
}: {
  count?: number;
  opacity?: number;
}) {
  // Web + Mobile hem işlär
  const flakes = useMemo<Flake[]>(() => {
    return new Array(count).fill(0).map(() => ({
      x: rand(0, W),
      size: rand(1.5, 3.5),
      opacity: rand(0.25, 0.85),
      speedMs: rand(7000, 14000), // slow fall
      drift: rand(-18, 18),
      delayMs: rand(0, 2000),
    }));
  }, [count]);

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
      }}
    >
      {flakes.map((f, i) => (
        <SnowFlake key={i} flake={f} />
      ))}
    </View>
  );
}
