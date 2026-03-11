import {
  Close as CancelIcon,
  DirectionsCar as CarIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userClient } from '../api/userClient';
import { vehicleClient } from '../api/vehicleClient';
import type { User } from '../types/User';
import type { Vehicle } from '../types/Vehicle';

interface UserProfileDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UserProfileDialog({
  open,
  user,
  onClose,
  onUpdate,
}: UserProfileDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      setIsAddingVehicle(false);
    }
  }, [user]);

  useEffect(() => {
    if (!open || !user?.id) return;

    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const res = await vehicleClient.get<Vehicle[]>(`/vehicles?userId=${user.id}`);
        setUserVehicles(res.data);
      } catch (error) {
        console.error('Помилка завантаження авто:', error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, [open, user?.id]);

  const handleUpdateUser = async () => {
    if (!formData.email.includes('@')) {
      return toast.error('Введіть коректний Email');
    }
    if (formData.firstName.length < 2) {
      return toast.error("Ім'я занадто коротке");
    }

    const updatePromise = userClient.patch(`/users/${user!.id}`, formData);

    toast.promise(updatePromise, {
      loading: 'Оновлення...',
      success: () => {
        onUpdate();
        return 'Дані оновлено';
      },
      error: 'Помилка оновлення',
    });
  };

  const handleSaveVehicle = async () => {
    if (!newVehicle.make || !newVehicle.model) {
      return toast.error('Заповніть марку та модель авто');
    }

    try {
      const res = await vehicleClient.post('/vehicles', {
        ...newVehicle,
        userId: user?.id,
      });

      setUserVehicles((prev) => [...prev, res.data]);
      setIsAddingVehicle(false);
      setNewVehicle({ make: '', model: '', year: new Date().getFullYear() });

      toast.success('Автомобіль додано клієнту');
    } catch (err) {
      toast.error('Не вдалося додати автомобіль');
      console.error(err);
    }
  };

  const handleDeleteVehicle = async (vId: string) => {
    if (!confirm('Видалити авто з реєстру?')) return;
    try {
      await vehicleClient.delete(`/vehicles/${vId}`);
      setUserVehicles((prev) => prev.filter((v) => v.id !== vId));
      toast.success('Авто видалено');
    } catch (err) {
      toast.error('Не вдалося видалити авто');
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-black uppercase italic text-orange-500">
        Профіль Клієнта
      </DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4 mt-2">
          <Box className="grid grid-cols-2 gap-4">
            <TextField
              label="Ім'я"
              fullWidth
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              variant="filled"
              className="bg-slate-800 rounded overflow-hidden"
            />
            <TextField
              label="Прізвище"
              fullWidth
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              variant="filled"
              className="bg-slate-800 rounded overflow-hidden"
            />
          </Box>
          <TextField
            label="E-mail"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            variant="filled"
            className="bg-slate-800 rounded overflow-hidden"
          />
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black italic rounded-xl py-3"
          >
            Зберегти зміни профілю
          </Button>

          <Divider className="bg-slate-800 my-4" />

          <Box className="flex justify-between items-center mb-2">
            <Typography variant="h6" className="font-bold uppercase text-sm text-slate-500">
              Транспортні засоби ({userVehicles.length})
            </Typography>
          </Box>

          <Box className="flex flex-col gap-2 min-h-25">
            {loadingVehicles ? (
              <Box className="flex justify-center py-6">
                <CircularProgress size={30} className="text-orange-500" />
              </Box>
            ) : userVehicles.length > 0 ? (
              userVehicles.map((v) => (
                <Box
                  key={v.id}
                  className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700 hover:border-slate-500 transition-all"
                >
                  <Box className="flex items-center gap-3">
                    <CarIcon className="text-orange-500" />
                    <Box>
                      <Typography className="font-bold text-white leading-none">
                        {v.make} {v.model}
                      </Typography>
                      <Typography variant="caption" className="text-slate-500">
                        {v.year} рік
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteVehicle(v.id)}
                    sx={{ color: '#64748b', '&:hover': { color: '#F93816' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))
            ) : (
              !isAddingVehicle && (
                <Typography className="text-center text-slate-600 py-6 italic text-sm">
                  Автомобілі не знайдені
                </Typography>
              )
            )}

            <Collapse in={isAddingVehicle}>
              <Box className="bg-slate-800/80 p-4 rounded-xl border border-orange-500/30 mb-4 flex flex-col gap-3">
                <Typography className="text-orange-500 font-bold text-xs uppercase">
                  Нове авто
                </Typography>
                <Box className="grid grid-cols-2 gap-2">
                  <TextField
                    size="small"
                    label="Марка"
                    variant="standard"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                  />
                  <TextField
                    size="small"
                    label="Модель"
                    variant="standard"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  />
                </Box>
                <Box className="flex gap-2 items-center">
                  <TextField
                    size="small"
                    label="Рік"
                    type="number"
                    variant="standard"
                    className="w-24"
                    value={newVehicle.year}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })
                    }
                  />
                  <Box className="flex-1" />
                  <IconButton onClick={() => setIsAddingVehicle(false)} color="error">
                    <CancelIcon />
                  </IconButton>
                  <IconButton onClick={handleSaveVehicle} color="success">
                    <CheckIcon />
                  </IconButton>
                </Box>
              </Box>
            </Collapse>

            {!isAddingVehicle && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsAddingVehicle(true)}
                className="border-dashed border-slate-700 text-slate-500 hover:border-orange-500 transition-all"
              >
                + Додати авто для клієнта
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
