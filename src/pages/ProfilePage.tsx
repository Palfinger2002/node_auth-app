import { Navigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useAuth } from '../components/AuthContext';

export const ProfilePage = () => {
  const { isChecked, currentUser } = useAuth();

  if (!isChecked) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="">
      <h1 className="title">Profile</h1>
      <p>Name: {currentUser.name}</p>
      <p>Email: {currentUser.email}</p>
    </section>
  );
};
