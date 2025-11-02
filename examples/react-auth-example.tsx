import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

/**
 * Hook personalizado para autenticación con MetaMask usando la API Ether3
 * 
 * Este hook integra wagmi con la API de autenticación para proporcionar
 * funcionalidad similar a los hooks ENS que mencionaste, pero desde el backend.
 */
export const useEther3Auth = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{
    address: string;
    ensName?: string;
    ensAvatar?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  /**
   * Solicita un challenge del servidor
   */
  const requestChallenge = async (userAddress: string): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: userAddress }),
    });
    if (!response.ok) {
      throw new Error('Failed to request challenge');
    }
    const data = await response.json();
    return data.challenge;
  };

  /**
   * Verifica la firma y obtiene el token JWT
   */
  const verifySignature = async (
    address: string,
    signature: string,
    challenge: string,
  ): Promise<{ accessToken: string; user: any }> => {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        signature,
        challenge,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify signature');
    }
    return await response.json();
  };

  /**
   * Inicia el proceso de autenticación
   */
  const login = async (): Promise<void> => {
    if (!address || !isConnected) {
      throw new Error('MetaMask not connected');
    }
    setIsLoading(true);
    setError(null);
    try {
      const challenge = await requestChallenge(address);
      const signature = await signMessageAsync({ message: challenge });
      const result = await verifySignature(address, signature, challenge);
      setToken(result.accessToken);
      setUser(result.user);
      setIsAuthenticated(true);
      localStorage.setItem('ether3_token', result.accessToken);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cierra la sesión
   */
  const logout = (): void => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ether3_token');
  };

  /**
   * Obtiene el perfil del usuario autenticado
   */
  const getProfile = async (): Promise<void> => {
    const savedToken = token || localStorage.getItem('ether3_token');
    if (!savedToken) {
      throw new Error('Not authenticated');
    }
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get profile');
      }
      const profile = await response.json();
      setUser(profile);
      setToken(savedToken);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to get profile');
      logout();
    }
  };

  /**
   * Verifica el token guardado al cargar el componente
   */
  useEffect(() => {
    const savedToken = localStorage.getItem('ether3_token');
    if (savedToken && address) {
      getProfile().catch(() => {
        logout();
      });
    }
  }, [address]);

  return {
    isAuthenticated,
    isLoading,
    error,
    user,
    token,
    login,
    logout,
    getProfile,
  };
};

/**
 * Hook para obtener el perfil ENS de una dirección (sin autenticación)
 */
export const useEnsProfile = (address?: string) => {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!address) {
      setEnsName(null);
      setEnsAvatar(null);
      return;
    }
    setIsLoading(true);
    fetch(`${API_URL}/auth/ens/${address}`)
      .then((res) => res.json())
      .then((data) => {
        setEnsName(data.ensName || null);
        setEnsAvatar(data.ensAvatar || null);
      })
      .catch(() => {
        setEnsName(null);
        setEnsAvatar(null);
      })
      .finally(() => setIsLoading(false));
  }, [address]);

  return { ensName, ensAvatar, isLoading };
};

/**
 * Ejemplo de componente que usa los hooks
 */
export const AuthExample = () => {
  const { address } = useAccount();
  const { ensName, ensAvatar } = useEnsProfile(address);
  const {
    isAuthenticated,
    isLoading,
    error,
    user,
    login,
    logout,
  } = useEther3Auth();

  return (
    <div>
      <h1>Ether3 Authentication Example</h1>
      {address ? (
        <div>
          <p>Address: {address}</p>
          {ensName && <p>ENS Name: {ensName}</p>}
          {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
          {!isAuthenticated ? (
            <button onClick={login} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Login with MetaMask'}
            </button>
          ) : (
            <div>
              <p>Authenticated as: {user?.address}</p>
              {user?.ensName && <p>ENS: {user.ensName}</p>}
              {user?.ensAvatar && (
                <img src={user.ensAvatar} alt="User Avatar" />
              )}
              <button onClick={logout}>Logout</button>
            </div>
          )}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
      ) : (
        <p>Please connect MetaMask</p>
      )}
    </div>
  );
};
