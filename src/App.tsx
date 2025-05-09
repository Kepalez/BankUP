import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from "./styles";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
  Alert, 
  StatusBar 
} from 'react-native';
import LoginPage from './pages/LoginPage';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Transfer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
interface Transfer {
  id: string;
  amount: number;
  destination: string;
  date: string;
}

interface User {
  username: string;
  password: string;
  accountNumber: string;
  balance: number;
  transfers: Transfer[];
}
const MOCK_USER: User = {
  username: 'usuario',
  password: '12345', 
  accountNumber: '12345678',
  balance: 5000,
  transfers: [
    { id: '1', amount: 200, destination: '87654321', date: '2025-05-01' },
    { id: '2', amount: 150, destination: '87654321', date: '2025-05-03' },
    { id: '3', amount: 300, destination: '11223344', date: '2025-05-05' },
  ]
};

const VALID_ACCOUNTS: string[] = ['87654321', '11223344', '99887766'];

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, type = 'primary' }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        type === 'primary' ? styles.buttonPrimary : styles.buttonSecondary
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText,
        type === 'primary' ? styles.buttonTextPrimary : styles.buttonTextSecondary
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};


interface ScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<ScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Cuenta</Text>
      </View>
      
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Text style={styles.balanceAmount}>${MOCK_USER.balance.toLocaleString()}</Text>
        <Text style={styles.accountNumber}>Cuenta: {MOCK_USER.accountNumber}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <CustomButton 
          title="Realizar Transferencia" 
          onPress={() => navigation.navigate('Transfer')}
        />
      </View>
      
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Historial de Transferencias</Text>
        
        <FlatList
          data={MOCK_USER.transfers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAccount}>A: {item.destination}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>- ${item.amount}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No hay transferencias realizadas</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const TransferScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>('');
  const [destinationAccount, setDestinationAccount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validateTransfer = (): boolean => {
    if (!amount.trim()) {
      setError('Ingrese un monto a transferir');
      return false;
    }
    
    // Validar que el monto sea un número positivo
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Ingrese un monto válido');
      return false;
    }
    
    // Validar que tenga fondos suficientes
    if (amountValue > MOCK_USER.balance) {
      setError('Fondos insuficientes para realizar la transferencia');
      return false;
    }
    
    // Validar que se haya ingresado una cuenta destino
    if (!destinationAccount.trim()) {
      setError('Ingrese la cuenta destino');
      return false;
    }
    
    // Validar que la cuenta destino exista
    if (!VALID_ACCOUNTS.includes(destinationAccount)) {
      setError('La cuenta destino no existe');
      return false;
    }
    
    // Validar que no sea la misma cuenta
    if (destinationAccount === MOCK_USER.accountNumber) {
      setError('No puede transferir a su propia cuenta');
      return false;
    }
    
    return true;
  };

  const handleTransfer = (): void => {
    if (validateTransfer()) {
      // Simular transferencia exitosa
      Alert.alert(
        "Transferencia Exitosa",
        `Se han transferido $${amount} a la cuenta ${destinationAccount}`,
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Realizar Transferencia</Text>
      </View>
      
      <View style={styles.transferContainer}>
        <View style={styles.balanceInfoContainer}>
          <Text style={styles.balanceInfoLabel}>Saldo Disponible:</Text>
          <Text style={styles.balanceInfoValue}>${MOCK_USER.balance.toLocaleString()}</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Monto a Transferir ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setError('');
            }}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Número de Cuenta Destino</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el número de cuenta"
            keyboardType="numeric"
            value={destinationAccount}
            onChangeText={(text) => {
              setDestinationAccount(text);
              setError('');
            }}
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.transferButtonContainer}>
          <CustomButton title="Transferir" onPress={handleTransfer} />
          <CustomButton 
            title="Cancelar" 
            type="secondary" 
            onPress={() => navigation.goBack()} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={LoginPage}/>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;