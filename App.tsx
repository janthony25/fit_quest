import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CharacterCreationScreen from './screens/CharacterCreationScreen';
import CharacterNameScreen from './screens/CharacterNameScreen';
import MainScreen from './screens/MainScreen';
import BattleScreen from './screens/BattleScreen';
import StoreScreen from './screens/StoreScreen';
import SettingsScreen from './screens/SettingsScreen';
import InventoryScreen from './screens/InventoryScreen';
import MapEnemiesScreen from './screens/MapEnemiesScreen';

export type RootStackParamList = {
  Welcome: undefined;
  CharacterCreation: undefined;
  CharacterName: { characterClass: 'Knight' | 'Barbarian' | 'Assassin' };
  Tabs: undefined;
  Inventory: undefined;
  MapEnemies: { mapName: string; mapImage: any };
};

export type TabParamList = {
  Character: undefined;
  Battle: undefined;
  Store: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Character: '⚔️',
    Battle: '📜',
    Store: '🏪',
    Settings: '⚙️',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icons[label]}</Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Text style={{
            fontSize: 10,
            letterSpacing: 1,
            fontWeight: '700',
            color: focused ? '#c9933a' : '#4a3318',
            marginBottom: 4,
          }}>
            {route.name.toUpperCase()}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: '#120a03',
          borderTopColor: '#3a2410',
          borderTopWidth: 1,
          height: 70,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: '#120a03' }} />
        ),
      })}
    >
      <Tab.Screen name="Character" component={MainScreen} />
      <Tab.Screen name="Battle" component={BattleScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { session, loading, hasCharacter } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a0e05', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#c9933a" size="large" />
      </View>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {hasCharacter ? (
          <>
            <Stack.Screen name="Tabs" component={MainTabs} />
            <Stack.Screen name="Inventory" component={InventoryScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="MapEnemies" component={MapEnemiesScreen} options={{ animation: 'slide_from_right' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="CharacterCreation" component={CharacterCreationScreen} />
            <Stack.Screen name="CharacterName" component={CharacterNameScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
