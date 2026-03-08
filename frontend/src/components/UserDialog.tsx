import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userClient } from '../api/userClient';

const userSchema = z.object({
  email: z.string().email('Введіть коректну email адресу'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserDialog({ open, onClose, onSuccess }: UserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      setApiError('');
      await userClient.post('/users', data);

      reset();
      onSuccess();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setApiError(axiosError.response?.data?.message || 'Не вдалося створити користувача');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setApiError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      // Стилізуємо саме вікно діалогу під темну тему
      PaperProps={{
        sx: {
          borderRadius: 5,
          bgcolor: '#0f172a',
          backgroundImage: 'none',
          border: '1px solid #1e293b',
        },
      }}
    >
      <DialogTitle className="font-black text-2xl text-white italic uppercase pt-6">
        Новий <span className="text-orange-500">клієнт</span>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-5 pt-2">
          {apiError && (
            <Typography className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {apiError}
            </Typography>
          )}

          <TextField
            label="Email адреса"
            variant="outlined"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Box className="flex gap-4">
            <TextField label="Ім'я" variant="outlined" fullWidth {...register('firstName')} />
            <TextField label="Прізвище" variant="outlined" fullWidth {...register('lastName')} />
          </Box>

          <TextField
            label="Пароль для клієнта"
            type="password"
            variant="outlined"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </DialogContent>

        <DialogActions className="p-8 pt-4">
          <Button onClick={handleClose} className="text-slate-400 font-bold hover:text-white">
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl"
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            ЗБЕРЕГТИ
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
