import { zodResolver } from '@hookform/resolvers/zod';
import {
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
import { apiClient } from '../api/axios';

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
      await apiClient.post('/users', data);

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
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <DialogTitle className="font-black text-2xl text-gray-800">Новий клієнт</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-5">
          {apiError && (
            <Typography className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {apiError}
            </Typography>
          )}

          <TextField
            label="Email адреса"
            variant="filled"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <div className="flex gap-4">
            <TextField label="Ім'я" variant="filled" fullWidth {...register('firstName')} />
            <TextField label="Прізвище" variant="filled" fullWidth {...register('lastName')} />
          </div>

          <TextField
            label="Пароль для клієнта"
            type="password"
            variant="filled"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </DialogContent>

        <DialogActions className="p-6">
          <Button onClick={handleClose} color="inherit" disabled={loading} className="font-bold">
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="px-8 rounded-xl font-bold"
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Зберегти клієнта
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
