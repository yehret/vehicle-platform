import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Некоректний email'),
  password: z.string().min(6, 'Пароль занадто короткий'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setApiError('');
      await login(data);
      navigate('/users');
    } catch (err: any) {
      const error = err as AxiosError<{ message: string }>;
      setApiError(error.response?.data?.message || 'Помилка авторизації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center min-h-screen bg-gray-50">
      <Paper className="p-10 w-full max-w-md shadow-2xl rounded-2xl">
        <Typography variant="h4" className="mb-2 font-bold text-center text-blue-600">
          Вхід
        </Typography>
        <Typography variant="body2" className="mb-8 text-center text-gray-500">
          Панель керування автосервісом
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {apiError && (
            <Typography color="error" className="text-center font-medium bg-red-50 p-2 rounded">
              {apiError}
            </Typography>
          )}

          <TextField
            label="Email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Пароль"
            type="password"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            variant="contained"
            type="submit"
            size="large"
            disabled={loading}
            className="py-3 mt-2 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? <CircularProgress size={24} /> : 'Увійти'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
