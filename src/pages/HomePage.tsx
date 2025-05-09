import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from '../styles';
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


interface Transfer {
  id: string;
  amount: number;
  destination: string;
  date: string;
}

interface ScreenProps {
  navigation: any;
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

const HomeScreen = ( props: ScreenProps ) => {
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
          onPress={() => props.navigation.navigate('Transfer')}
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

export default HomeScreen;