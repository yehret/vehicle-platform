import { Delete as DeleteIcon, Info as InfoIcon, Logout as LogoutIcon } from '@mui/icons-material';
import {
  Avatar,
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
import { useEffect, useState } from 'react';
import { apiClient } from '../api/axios';
import UserDialog from '../components/UserDialog';
import { useAuthStore } from '../store/useAuthStore';
import type { User } from '../types/User';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user: admin, logout } = useAuthStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get<User[]>('/users');
      setUsers(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Помилка при завантаженні користувачів');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача?')) return;

    try {
      await apiClient.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert('Не вдалося видалити користувача');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Box className="flex justify-between items-center mb-8 p-4 bg-white shadow-sm border border-gray-100 rounded-2xl">
        <Box className="flex items-center gap-4">
          <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 'bold' }}>
            {admin?.firstName?.[0] || admin?.email?.[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" className="font-bold text-gray-800">
              {admin?.firstName} {admin?.lastName}
            </Typography>
            <Typography variant="caption" className="text-gray-500 block">
              Менеджер системи • {admin?.email}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={logout}
          className="rounded-lg font-bold"
        >
          Вийти
        </Button>
      </Box>

      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-gray-900 font-black tracking-tight">
          Клієнти
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl px-6 py-2 shadow-lg shadow-blue-200 normal-case font-bold"
        >
          + Створити користувача
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress size={60} thickness={4} />
        </div>
      )}

      {error && (
        <Paper className="p-4 bg-red-50 border border-red-100 mb-6">
          <Typography color="error" className="font-medium text-center">
            ⚠️ {error}
          </Typography>
        </Paper>
      )}

      {!loading && !error && (
        <TableContainer
          component={Paper}
          className="shadow-xl rounded-2xl overflow-hidden border border-gray-100"
        >
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-bold text-gray-600">ID</TableCell>
                <TableCell className="font-bold text-gray-600">Email</TableCell>
                <TableCell className="font-bold text-gray-600">Ім'я та Прізвище</TableCell>
                <TableCell className="font-bold text-gray-600" align="right">
                  Дії
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" className="py-20 text-gray-400">
                    <Typography variant="body1">Список користувачів порожній</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="font-mono text-xs text-gray-400">
                      #{user.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {user.firstName || user.lastName ? (
                        `${user.firstName || ''} ${user.lastName || ''}`
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box className="flex justify-end gap-1">
                        <IconButton color="info" size="small" title="Деталі">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          title="Видалити"
                          onClick={() => handleDelete}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserDialog open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />
    </div>
  );
}
