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

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      const adminRole = data.role_id === 1 || data.roleId === 1;

      if (response.ok) {
        if (adminRole){
          console.log('Navigating to AdminHome with role_id:', data.role_id);
          props.navigation.navigate('AdminHome', { userId: data.userId})
        }else{
          console.log('Navigating to Home with role_id:', data.role_id);
          props.navigation.navigate('Home', { userId: data.userId });
        }
        
      } else {
        if (data.attemptsLeft !== undefined) {
          setError(`${data.error} (Intentos restantes: ${data.attemptsLeft})`);
        } else {
          setError(data.error || 'Error al iniciar sesión');
        }
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor');
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
        
      </View>
    </SafeAreaView>
  );
};
export default LoginScreen;