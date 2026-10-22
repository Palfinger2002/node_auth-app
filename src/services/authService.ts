import { authClient as client } from '../http/authClient';
import { User } from '../types/user';

interface AuthData {
  accessToken: string;
  user: User;
}

export const authService = {
  register: (name: string, email: string, password: string) => {
    return client.post('/registration', { name, email, password });
  },

  activate: (name: string, email: string, token: string): Promise<AuthData> => {
    return client.get(
      `/activation/${encodeURIComponent(name)}/${encodeURIComponent(email)}/${encodeURIComponent(token)}`,
    );
  },

  login: (name: string, email: string, password: string): Promise<AuthData> => {
    return client.post('/login', { name, email, password });
  },

  logout: () => client.post('/logout'),

  refresh: (): Promise<AuthData> => client.get('/refresh'),
};
