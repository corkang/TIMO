import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { User } from '../models';
import { storage } from '../utils/storage';

export default function useAuth() {
  const [cookies, setCookies, removeCookies] = useCookies('user');
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    storage.remove('accessToken');
    setState(false);
  };

  useEffect(() => {
    if (cookies.accessToken) {
      storage.set('accessToken', cookies.accessToken);
      removeCookies('accessToken');
    }
    User.getAuth()
      .then((res) => setState(res.data.authenticated))
      .catch(() => setState(false))
      .finally(() => setLoading(false));
  }, [cookies.accessToken, removeCookies]);

  return [state, logout, loading];
}
