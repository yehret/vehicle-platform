// src/components/VehicleDialog.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { userClient } from '../api/userClient';
import { vehicleClient } from '../api/vehicleClient';
import type { User } from '../types/User';
import type { Vehicle } from '../types/Vehicle';

const vehicleSchema = z.object({
  make: z.string().min(2, 'Вкажіть марку'),
  model: z.string().min(1, 'Вкажіть модель'),
  year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  userId: z.string().uuid('Оберіть власника зі списку'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleDialogProps {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VehicleDialog({ open, vehicle, onClose, onSuccess }: VehicleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema) as Resolver<VehicleFormData>,
  });

  useEffect(() => {
    if (open) {
      userClient.get<User[]>('/users').then((res) => setUsers(res.data));

      reset(
        vehicle
          ? {
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year ?? new Date().getFullYear(),
              userId: vehicle.userId,
            }
          : {
              make: '',
              model: '',
              year: new Date().getFullYear(),
              userId: '',
            },
      );
    }
  }, [open, vehicle, reset]);

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setLoading(true);
      if (vehicle) await vehicleClient.put(`/vehicles/${vehicle.id}`, data);
      else await vehicleClient.post('/vehicles', data);
      toast.success('Авто збережено');
      onSuccess();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      const errorMessage = axiosError.response?.data?.message || 'Помилка збереження';
      setApiError(errorMessage);

      console.error('API Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="font-black text-2xl text-white italic uppercase pt-6">
        {vehicle ? 'Редагувати' : 'Додати'} <span className="text-orange-500">Авто</span>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-5 pt-2">
          {apiError && <Typography color="error">{apiError}</Typography>}

          <TextField
            label="Марка"
            variant="outlined"
            fullWidth
            {...register('make')}
            error={!!errors.make}
            helperText={errors.make?.message}
          />
          <TextField
            label="Модель"
            variant="outlined"
            fullWidth
            {...register('model')}
            error={!!errors.model}
            helperText={errors.model?.message}
          />
          <TextField
            label="Рік"
            type="number"
            variant="outlined"
            fullWidth
            {...register('year')}
            error={!!errors.year}
            helperText={errors.year?.message}
          />

          <TextField
            select
            label="Власник автомобіля"
            fullWidth
            defaultValue=""
            {...register('userId')}
            error={!!errors.userId}
            helperText={errors.userId?.message}
            disabled={!!vehicle}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box>
                  <Typography variant="body2" className="font-bold">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" className="text-slate-500">
                    {user.email}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions className="p-8 pt-4">
          <Button onClick={onClose} className="text-slate-400 font-bold">
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="bg-orange-500 text-slate-950 font-black rounded-xl px-8"
          >
            {loading ? <CircularProgress size={24} /> : 'ЗБЕРЕГТИ'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
