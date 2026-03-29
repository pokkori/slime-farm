import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../src/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME_COLORS.tabBarActive,
        tabBarInactiveTintColor: THEME_COLORS.tabBarInactive,
        tabBarStyle: {
          backgroundColor: THEME_COLORS.tabBar,
          borderTopColor: THEME_COLORS.cardBorder,
        },
        headerStyle: {
          backgroundColor: THEME_COLORS.headerBg,
        },
        headerTintColor: THEME_COLORS.headerText,
        headerTitleStyle: {
          fontWeight: 'bold',
          textShadowColor: THEME_COLORS.primary,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="ranch"
        options={{
          title: '牧場',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="encyclopedia"
        options={{
          title: '図鑑',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'ショップ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'ミッション',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
