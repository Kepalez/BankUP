import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './pages/LoginPage';
import HomeScreen from './pages/HomePage';
import TransferScreen from './pages/TransferPage';
import AdminPage from './pages/AdminPage';

type RootStackParamList = {
  Login: undefined;
  Home: {userId: number | null};
  AdminHome: undefined;
  Transfer: {userId:number | null};
};

const Stack  = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={LoginPage}/>
        <Stack.Screen name="Home" component={HomeScreen} initialParams={{userId:null}}/>
        <Stack.Screen name="AdminHome" component={AdminPage}/>
        <Stack.Screen name="Transfer" component={TransferScreen} initialParams={{userId:null}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;