import { useState, useEffect } from 'react';
import { Search, RefreshCw, User, AlertCircle, FileText, Lock, Unlock, CheckCircle, XCircle } from 'lucide-react';

type UserStatus = 'active' | 'inactive' | 'blocked';
type AccountStatus = 'active' | 'closed' | 'frozen';

interface User {
  id: number;
  username: string;
  client_name: string;
  status: UserStatus;
  role: string;
  failed_attempts: number;
}

interface Account {
  id: number;
  account_number: string;
  client_name: string;
  balance: number;
  status: AccountStatus;
  aperture_date: string;
}

const handleFetchError = (response: Response) => {
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return response.json();
};

export default function AdminDashboard() {
  // State for users and accounts data
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'accounts'>('users');

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users data
      const usersData = await fetch(`http://localhost:5000/api/users`)
        .then(handleFetchError);
      setUsers(usersData);
      
      // Fetch accounts data
      const accountsData = await fetch(`http://localhost:5000/api/accounts`)
        .then(handleFetchError);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  const handleUnblockUser = async (userId: number) => {
    try {
      await fetch(`http://localhost:5000/api/users/${userId}/unblock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(handleFetchError);
      
      // Refresh users data
      const usersData = await fetch(`http://localhost:5000/api/users`)
        .then(handleFetchError);
      setUsers(usersData);
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleUnfreezeAccount = async (accountId: number) => {
    try {
      await fetch(`http://localhost:5000/api/accounts/${accountId}/unfreeze`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(handleFetchError);
      
      // Refresh accounts data
      const accountsData = await fetch(`http://localhost:5000/api/accounts`)
        .then(handleFetchError);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error unfreezing account:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(search.toLowerCase()) || 
    user.client_name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAccounts = accounts.filter(account => 
    account.account_number.toLowerCase().includes(search.toLowerCase()) || 
    account.client_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <button 
                className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={fetchData}
              >
                <RefreshCw size={18} className="inline mr-1" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User size={18} className="inline mr-2" />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'accounts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={18} className="inline mr-2" />
              Cuentas
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="mt-6 mb-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="Buscar por nombre o número de cuenta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="mt-4">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estatus
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Intentos fallidos
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.client_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : user.status === 'inactive'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.status === 'active' ? (
                                <>
                                  <CheckCircle size={14} className="mr-1" />
                                  Activo
                                </>
                              ) : user.status === 'inactive' ? (
                                <>
                                  <AlertCircle size={14} className="mr-1" />
                                  Inactivo
                                </>
                              ) : (
                                <>
                                  <Lock size={14} className="mr-1" />
                                  Bloqueado
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.failed_attempts}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.status === 'blocked' && (
                              <button
                                onClick={() => handleUnblockUser(user.id)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end ml-auto"
                              >
                                <Unlock size={16} className="mr-1" />
                                Desbloquear
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="mt-4">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Número de cuenta
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estatus
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha apertura
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAccounts.map((account) => (
                        <tr key={account.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{account.account_number}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{account.client_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                account.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : account.status === 'closed'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {account.status === 'active' ? (
                                <>
                                  <CheckCircle size={14} className="mr-1" />
                                  Activa
                                </>
                              ) : account.status === 'closed' ? (
                                <>
                                  <XCircle size={14} className="mr-1" />
                                  Cerrada
                                </>
                              ) : (
                                <>
                                  <AlertCircle size={14} className="mr-1" />
                                  Congelada
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${parseFloat(account.balance.toString()).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(account.aperture_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {account.status === 'frozen' && (
                              <button
                                onClick={() => handleUnfreezeAccount(account.id)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end ml-auto"
                              >
                                <Unlock size={16} className="mr-1" />
                                Descongelar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}