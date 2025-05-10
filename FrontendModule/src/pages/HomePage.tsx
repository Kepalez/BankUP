import React, { useEffect, useState } from 'react';
import styles from '../styles';
import { StackScreenProps } from '@react-navigation/stack';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
} from 'react-native';


interface Transfer {
  id: string;
  amount: number;
  destination: string;
  date: string;
}

type RootStackParamList = {
  Login: undefined;
  Home: {userID: number | null};
  Transfer: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Home'>;

interface User {
  id:number,
  first_name:string,
  last_name:string,
  curp:string,
  rfc:string,
  phone:string,
  email:string
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

const HomeScreen: React.FC<Props> = ( {route, navigation} ) => {
  const [client, setClient] = useState<User>();
  const { userID } = route.params; // 👈 Aquí accedes correctamente al parámetro

  useEffect(()=>{
    fetchClient();
  },[userID]);

  useEffect(()=>{
    console.log(client);
  },[client]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${userID}`);
      if (!response.ok) {
        throw new Error('Cliente no encontrado');
      }
      const data = await response.json();
      setClient(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Cuenta</Text>
      </View>
      
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Text style={styles.balanceAmount}>${1000000}</Text>
        <Text style={styles.accountNumber}>Cuenta: {client ? client.first_name+client.last_name : "Undefined"}</Text>
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
          data={[
            { id: '1', amount: 200, destination: '87654321', date: '2025-05-01' },
            { id: '2', amount: 150, destination: '87654321', date: '2025-05-03' },
            { id: '3', amount: 300, destination: '11223344', date: '2025-05-05' },
          ]}
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