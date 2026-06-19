import { Dimensions } from "react-native";

export const colors = {
    // Primary Colors
    primary: "#2563EB",        // Changed from #333333 to modern blue
    primaryDark: "#1D4ED8",
    primaryLight: "#60A5FA",
    
    // Secondary Colors
    secondary: "#10B981",      // Changed from #F8F8F8 to emerald green
    secondaryLight: "#34D399",
    
    // Brand Colors
    greenCustom:"#2563EB",    // Keeping your custom purple-blue
    lightGreen: "#2563EB",
    lightGreen1: "#2563EB",
    
    // Accent Colors
    yellow: "#FFC107",
    red: "#EF4444",            // Changed from #FF5733 to modern red
    cyan: "#06B6D4",
    
    // Neutral Colors
    black: "#000000",
    white: "#FFFFFF",
    dark: "#1F2937",           // Changed from #333333 to modern dark
    gray: "#6B7280",           // Changed from #808080 to modern gray
    lightGrey: "#9CA3AF",      // Changed from #D3D3D3 to modern light gray
    lightGrey2: "#E5E7EB",     // Changed from #e0e0e0 to lighter gray
    
 
    tertiary: "#F3F4F6",       // Updated from #F4F4F4
    quaternary: "#FFFFFF",     // Changed from #F9F9F9 to white
    
    // UI Elements
    drawerLineColor: "#E5E7EB", // Updated for better visibility
};

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;