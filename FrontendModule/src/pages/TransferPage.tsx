import React, { useEffect, useState } from 'react';
import styles from '../styles';
import { StackScreenProps } from '@react-navigation/stack';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';

type RootStackParamList = {
  Login: undefined;
  Home: {userId: number | null};
  Transfer: {userId: number | null};
};

type Props = StackScreenProps<RootStackParamList, 'Transfer'>;

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
interface Account{
  client_id : number,
  account_numbers: string,
  clabe: string,
  balance: number,
  aperture_date : Date,
  account_status_id: number,
}

const TransferScreen: React.FC<Props> = ({route, navigation}) => {

  const { userId } = route.params;
  const [recieverId, setRecieverId] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<Account>();
  const [recieverAccount, setRecieverAccount] = useState<Account>();
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [concepto, setConcepto] = useState<string>('');
  const [receiverIdentificationType, setRecieverIdentificationType] = useState<"CLABE" | "Cuenta" | "Inválido">("Inválido")
  const [recieverAccountNumber, setRecieverAccountNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [triggerValidation, setTriggerValidation] = useState<boolean>(false);


  useEffect(()=>{
    console.log("userID: ",userId);
    if(userId)
      fetchAccount();
  },[userId]);

  useEffect(()=>{
    if(!userAccount) return;
    setAccountBalance(userAccount.balance);

  },[userAccount]);

  useEffect(()=>{
    if(triggerValidation)
      handleTransfer();
  },[recieverAccount]);

  const fetchAccount = async () =>{
    try {
      const response = await fetch(`http://localhost:5000/api/accounts/${userId}`);
      if (!response.ok) {
        throw new Error('Cliente no encontrado');
      }
      const data = await response.json();
      setUserAccount(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecieverAccount = async (column : string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/find_account`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ column:column, value: recieverAccountNumber})
      });
      const data = await response.json();
      if (!response.ok || data.rows.length <= 0) {
        throw new Error('Cliente no encontrado');
      }
      setRecieverAccount(data.rows[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const cuentaDestinoExiste = (): boolean =>{
    if(recieverAccount) return true;
    return false;
  }

  const validateTransfer = (): boolean => {
    setTriggerValidation(false);
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
    if (amountValue > accountBalance) {
      setError('Fondos insuficientes para realizar la transferencia');
      return false;
    }

    if(!concepto.trim()){
      setError('Por favor, ingrese un concepto');
    }
    
    // Validar que se haya ingresado una cuenta destino
    if (!recieverAccountNumber.trim()) {
      setError('Ingrese la cuenta destino');
      return false;
    }
    
    // Validar que la cuenta destino exista
    if (!cuentaDestinoExiste()) {
      console.log("reciever account función: ",recieverAccount);
      setError('La cuenta destino no existe');
      return false;
    }
    console.log("Reciever final:  ", recieverAccount);
    // Validar que no sea la misma cuenta
    if (recieverAccountNumber === userAccount?.account_numbers) {
      setError('No puede transferir a su propia cuenta');
      return false;
    }
    
    return true;
  };

  const handleFetchReciever = () => {
    setTriggerValidation(true);
    let ident = "";
    switch(receiverIdentificationType){
      case 'CLABE':
        ident = "clabe";
        break;
      case 'Cuenta':
        ident = "account_number";
        break;
      case 'Inválido':
        ident = "invalido";
    }
    if(ident == "invalido") return;
    fetchRecieverAccount(ident);
  }

  const handleTransfer = (): void => {
    if (validateTransfer()) {
      // Simular transferencia exitosa
      realizarTransferencia();
    }
  };

  const realizarTransferencia = async () =>{
    try{
      const response = await fetch('http://localhost:5000/api/transfer',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userId,
          reciever_id: recieverAccount?.client_id,
          amount: parseFloat(amount),
          concept: concepto
        })
      })

      const data = await response.json();
      console.log("Data de la transferencia", data);
      if(response.ok){
        setShowSuccessMessage(true);
      }
    } catch{
      setError("Error inesperado en el sistema, inténtelo de nuevo más tarde");
    }
  }

  function identifyAccountType(account: string): "CLABE" | "Cuenta" | "Inválido" {
    const clabeRegex = /^\d{18}$/;
    const accountRegex = /^ACC\d{6}$/;

    if (clabeRegex.test(account)) {
      return "CLABE";
    } else if (accountRegex.test(account)) {
      return "Cuenta";
    } else {
      return "Inválido";
    }
  }

  const handleRecieverIdentification = (identification : string) =>{
    setRecieverIdentificationType(identifyAccountType(identification));
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Realizar Transferencia</Text>
      </View>
      
      <View style={styles.transferContainer}>
        <View style={styles.balanceInfoContainer}>
          <Text style={styles.balanceInfoLabel}>Saldo Disponible:</Text>
          <Text style={styles.balanceInfoValue}>${accountBalance.toLocaleString()}</Text>
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
          <Text style={styles.inputLabel}>Número de Cuenta o CLABE Destino</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el número de cuenta"
            keyboardType="numeric"
            value={recieverAccountNumber}
            onChangeText={(text) => {
              setRecieverAccountNumber(text);
              handleRecieverIdentification(text);
              setError('');
            }}
          />
          <Text style={styles.identificationText}>Tipo de identificador: {receiverIdentificationType}</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ingrese el concepto</Text>
          <TextInput
            style={styles.input}
            placeholder="Concepto..."
            value={concepto}
            onChangeText={(text) => {
              setConcepto(text);
              setError('');
            }}
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {showSuccessMessage ? <Text style={styles.successText}>Transferencia exitosa :D</Text> : null}
        
        <View style={styles.transferButtonContainer}>
          <CustomButton title="Transferir" onPress={handleFetchReciever} />
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

export default TransferScreen;