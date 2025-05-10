import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './pages/LoginPage';
import HomeScreen from './pages/HomePage';
import TransferScreen from './pages/TransferPage';
import AdminPage from './pages/AdminPage';

type RootStackParamList = {
  Login: undefined;
  AdminHome: undefined;
  Home: undefined;
  Transfer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={LoginPage}/>
        <Stack.Screen name="AdminHome" component={AdminPage}/>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;