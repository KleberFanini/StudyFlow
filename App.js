// App.js
import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Contextos Globais
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { SubjectProvider } from './src/context/SubjectContext';
import { COLORS } from './src/styles/theme';

// Telas de Autenticação
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Telas Principais da Aplicação
import DashboardScreen from './src/screens/DashboardScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import SubjectDetailsScreen from './src/screens/SubjectDetailsScreen';
import BooksSearchScreen from './src/screens/BooksSearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const RootStack = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação por Abas (Inferior)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'school';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Disciplinas') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Biblioteca') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Painel' }}
      />
      <Tab.Screen
        name="Disciplinas"
        component={SubjectsScreen}
        options={{ tabBarLabel: 'Disciplinas' }}
      />
      <Tab.Screen
        name="Biblioteca"
        component={BooksSearchScreen}
        options={{ tabBarLabel: 'Livros (API)' }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Meu Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Navegação para Usuário Deslogado
function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
}

// Navegador Central com Condicional de Sessão
function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? (
        <RootStack.Navigator>
          <RootStack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="SubjectDetails"
            component={SubjectDetailsScreen}
            options={{
              headerShown: false,
            }}
          />
        </RootStack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubjectProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SubjectProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
