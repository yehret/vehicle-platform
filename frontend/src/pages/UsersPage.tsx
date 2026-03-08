import { Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { userClient } from '../api/userClient';
import UserDialog from '../components/UserDialog';
import type { User } from '../types/User';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userClient.get<User[]>('/users');
      setUsers(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача?')) return;
    try {
      await userClient.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert('Не вдалося видалити користувача');
      console.error(err);
    }
  };

  return (
    <Box className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Box>
            <Typography
              variant="h3"
              className="text-white font-black tracking-tighter uppercase italic leading-none"
            >
              Клієнти <span className="text-orange-500">.DB</span>
            </Typography>
            <Typography
              variant="body2"
              className="text-slate-500 mt-2 font-medium uppercase tracking-widest"
            >
              Керування базою даних користувачів сервісу
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl px-8 py-3 shadow-lg shadow-orange-500/20 normal-case font-black italic"
          >
            + ДОДАТИ КЛІЄНТА
          </Button>
        </div>

        {loading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress color="primary" thickness={5} size={60} />
          </Box>
        ) : error ? (
          <Paper className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
            <Typography color="error" className="font-bold">
              ⚠️ {error}
            </Typography>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <Table>
              <TableHead className="bg-slate-800/50">
                <TableRow>
                  <TableCell className="text-slate-500 font-bold uppercase text-xs">ID</TableCell>
                  <TableCell className="text-slate-300 font-bold uppercase text-xs">
                    Email адреса
                  </TableCell>
                  <TableCell className="text-slate-300 font-bold uppercase text-xs">
                    ПІБ Клієнта
                  </TableCell>
                  <TableCell align="right" className="text-slate-500 font-bold uppercase text-xs">
                    Дії
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <TableCell className="font-mono text-[10px] text-slate-600">
                      #{user.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-white font-medium">{user.email}</TableCell>
                    <TableCell className="text-slate-400">
                      {user.firstName || user.lastName ? (
                        <span className="text-white font-bold">
                          {user.firstName} {user.lastName}
                        </span>
                      ) : (
                        <span className="italic text-slate-600 text-sm">Дані не заповнені</span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box className="flex justify-end gap-2">
                        <IconButton
                          size="small"
                          className="text-slate-500 hover:text-orange-500 transition-colors"
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          className="text-slate-500 hover:text-red-500 transition-colors"
                          onClick={() => handleDelete(user.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      <UserDialog open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />
    </Box>
  );
}
