import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";

// Liquid Glass is iOS 26 and up. Everything else gets a blur, which is the same idea
// with less depth, and Android falls back again to a translucent fill inside BlurView.
const LIQUID_GLASS = isLiquidGlassAvailable();

interface GlassSurfaceProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export default function GlassSurface({ style, children }: GlassSurfaceProps) {
  if (LIQUID_GLASS) {
    return (
      <GlassView glassEffectStyle="regular" colorScheme="dark" style={style}>
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView intensity={40} tint="dark" style={style}>
      {children}
    </BlurView>
  );
}
