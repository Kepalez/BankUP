import React, { useState } from 'react';
import styles from '../styles';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

interface ScreenProps {
  navigation: any;
}

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


const LoginScreen = (props: ScreenProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (): void => {
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      props.navigation.navigate('Home');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#0066CC' />
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>UPBANK</Text>
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

export default LoginScreen;