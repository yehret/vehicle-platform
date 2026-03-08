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
      navigate('/vehicles');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setApiError(error.response?.data?.message || 'Помилка авторизації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-950 px-4">
      <Paper className="p-10 w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl">
        <Typography
          variant="h4"
          className="mb-2 font-black text-center text-white uppercase italic tracking-tighter"
        >
          VEHICLE<span className="text-orange-500">SERVICE</span>
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 2 }}
          className="text-center text-slate-500 font-medium uppercase tracking-widest text-xs"
        >
          Панель керування сервісом
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {apiError && (
            <Typography className="text-center font-bold text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-sm">
              {apiError}
            </Typography>
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
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
            className="py-4 mt-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : 'УВІЙТИ'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
