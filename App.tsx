import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

interface User {
  username: string;
  password: string;
  accountNumber: string;
  balance: number;
  transfers: Transfer[];
}

interface Transfer {
  id: string;
  amount: number;
  destination: string;
  date: string;
}

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Transfer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const COLORS = {
  primary: '#0066CC',    
  secondary: '#00A3E0',   
  accent: '#FFD100',      
  background: '#F9FBFC',  
  text: '#333333',        
  textLight: '#666666',   
  border: '#E1E1E1',     
  success: '#4CAF50',     
  error: '#F44336',       
  white: '#FFFFFF',       
};

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
const LoginScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (): void => {
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      navigation.navigate('Home');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>BANCO</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Bienvenido</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su usuario"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su contraseña"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <CustomButton title="Iniciar Sesión" onPress={handleLogin} />
        
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Estilos de Login
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Estilos para botones
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextPrimary: {
    color: COLORS.white,
  },
  buttonTextSecondary: {
    color: COLORS.primary,
  },
  
  // Estilos de la pantalla Home
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: COLORS.white,
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  accountNumber: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  actionsContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAccount: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  emptyListText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
  },
  
  // Estilos de la pantalla de transferencia
  transferContainer: {
    flex: 1,
    padding: 20,
  },
  balanceInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceInfoLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  balanceInfoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  transferButtonContainer: {
    marginTop: 20,
  },
});

export default App;