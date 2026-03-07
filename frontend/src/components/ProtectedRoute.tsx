import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = () => {
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!user) checkAuth();
  }, []);

  if (isLoading) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
