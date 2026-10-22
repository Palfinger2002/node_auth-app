import { httpClient } from '../http/httpClient';
import { User } from '../types/user';

export const userService = {
  getAll: (): Promise<User[]> => httpClient.get('/users'),
  updateName: (name: string): Promise<User> =>
    httpClient.put('/users/name', { name }),
  updateEmail: (email: string): Promise<User> =>
    httpClient.put('/users/email', { email }),
  updatePassword: (password: string): Promise<User> =>
    httpClient.put('/users/password', { password }),
};
