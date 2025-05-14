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
  amount: string;
  concept: string;
  destination_client_name:string;
  source_client_name: string;
  transfer_date: Date;
}

type RootStackParamList = {
  Login: undefined;
  Home: {userId: number | null};
  Transfer: {userId: number | null};
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
  const [clientName, setClientName] = useState<string>("no nombre de usuario");
  const [clientBalance, setClientBalance] = useState<number>(0);
  const [clientTransferences, setClientTransferences] = useState<Transfer[]>([]);
  const { userId } = route.params;

  useEffect(()=>{
    console.log("User ID: ",userId);
    fetchClient();
    fetchBalance();
    fetchTransferences();
  },[userId]);

  useEffect(()=>{
    if(client){
      setClientName(client.first_name+" "+client.last_name);
    }
  },[client]);

  useEffect(()=>{
    console.log(clientBalance);
  },[clientBalance]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${userId}`);
      if (!response.ok) {
        throw new Error('Cliente no encontrado');
      }
      const data = await response.json();
      setClient(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}/balance`);
      if (!response.ok) {
        throw new Error('Cliente no encontrado');
      }
      const data = await response.json();
      setClientBalance(data[0].balance);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTransferences = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}/transferences`);
      if (!response.ok) {
        throw new Error('Cliente no encontrado');
      }
      const data = await response.json();
      console.log("Transferences: ",data);
      setClientTransferences(data);
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
        <Text style={styles.balanceAmount}>${clientBalance ?? "noaaaah"}</Text>
        <Text style={styles.accountNumber}>Cuenta: {client ? client.first_name+" "+client.last_name : "Undefined"}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <CustomButton 
          title="Realizar Transferencia" 
          onPress={() => navigation.navigate('Transfer',{userId : userId})}
        />
      </View>
      
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Historial de Transferencias</Text>
        
        <FlatList
          data={clientTransferences}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionDetails}>
                <div className='flex flex-row gap-x-4'>
                <Text style={styles.transactionAccount}>Destinatario: {item.destination_client_name}</Text>
                <Text style={styles.transactionAccount}>Receptor: {item.source_client_name}</Text>
                </div>
                <Text style={styles.transactionAccount}>Concepto: {item.concept}</Text>
                <Text style={styles.transactionDate}>{item.transfer_date.toString().split("T")[0]}</Text>
              </View>
              {item.destination_client_name == clientName ? 
              (<Text style={styles.transactionAmountPositive}>+ ${item.amount}</Text>):
              (<Text style={styles.transactionAmountNegative}>- ${item.amount}</Text>)}
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