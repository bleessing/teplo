import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle, View } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
    'house.fill': 'home',

    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that supports rendering multiple icons for specific tabs or falls back to Material Icons.
 * This ensures a consistent look across platforms, and optimal resource usage.
 */
export function IconSymbol({
                               name,
                               size = 24,
                               color,
                               style,
                           }: {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
    weight?: SymbolWeight;
}) {
    // Special case for the "explore" tab to show two icons
    if (name === 'paperplane.fill') {
        return (
            <View style={[ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }]}>

                <Feather name="tool" size={size} color={color} />
            </View>
        );
    }
    if (name === 'house.fill') {
        return (
            <View style={[ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }]}>

                <Feather name="home" size={size} color={color} />
            </View>
        );
    }

    // Fallback to the original mapping for other tabs (e.g., "house.fill")
    return <MaterialCommunityIcons name="radiator" size={size} color={color} />;
}