import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../store/store';

/**
 * AuthRoute — пропускает только НЕ авторизованных пользователей.
 * Если пользователь уже вошёл, перенаправляет на главную страницу.
 */
const AuthRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRoute;
