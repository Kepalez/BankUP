import { StyleSheet } from 'react-native';

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
  transactionAmountNegative: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  transactionAmountPositive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
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

export default styles;