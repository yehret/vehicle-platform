import { DirectionsCar as CarIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { userClient } from '../api/userClient';
import { vehicleClient } from '../api/vehicleClient';
import VehicleDialog from '../components/VehicleDialog';
import { VehicleRowItem } from '../components/VehicleRowItem';
import type { User } from '../types/User';
import type { Vehicle } from '../types/Vehicle';

type SortKey = 'make' | 'year' | 'owner';
type SortDirection = 'asc' | 'desc';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'make',
    direction: 'asc',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [vRes, uRes] = await Promise.all([
        vehicleClient.get<Vehicle[]>('/vehicles'),
        userClient.get<User[]>('/users'),
      ]);
      setVehicles(vRes.data);
      setUsers(uRes.data);
    } catch (err) {
      console.error('Помилка завантаження', err);
      toast.error('Помилка завантаження');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getOwnerName = useCallback(
    (userId: string) => {
      const owner = users.find((u) => u.id === userId);
      if (!owner) return 'Невідомий';
      return owner.firstName || owner.lastName
        ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim()
        : owner.email;
    },
    [users],
  );

  const handleSort = (key: SortKey) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
    setSortConfig({
      key,
      direction: isAsc ? 'desc' : 'asc',
    });
  };

  const sortedVehicles = useMemo(() => {
    const items = [...vehicles];
    return items.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      if (sortConfig.key === 'owner') {
        aValue = getOwnerName(a.userId).toLowerCase();
        bValue = getOwnerName(b.userId).toLowerCase();
      } else {
        aValue = a[sortConfig.key] || '';
        bValue = b[sortConfig.key] || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [vehicles, sortConfig, getOwnerName]);

  return (
    <Box className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-10 items-center">
          <Box className="flex items-center gap-4">
            <div className="bg-orange-500/10 p-4 rounded-3xl border border-orange-500/20">
              <CarIcon className="text-orange-500" sx={{ fontSize: 40 }} />
            </div>
            <Box>
              <Typography
                variant="h3"
                className="text-white font-black uppercase italic leading-none"
              >
                Garage <span className="text-orange-500">.Log</span>
              </Typography>
              <Typography
                variant="body2"
                className="text-slate-500 mt-2 font-medium uppercase tracking-widest"
              >
                Технічний реєстр транспортних засобів
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedVehicle(null);
              setIsDialogOpen(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl px-8 py-3 font-black italic"
          >
            + ДОДАТИ АВТО
          </Button>
        </div>

        {loading ? (
          <Box className="flex justify-center py-20">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Table>
              <TableHead className="bg-slate-800/50">
                <TableRow>
                  <TableCell className="text-slate-500 font-bold uppercase text-xs">Code</TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'make'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('make')}
                      className="text-slate-300 font-bold uppercase text-xs hover:text-orange-500"
                      sx={{
                        '&.Mui-active': { color: '#f97316 !important' },
                        '& .MuiTableSortLabel-icon': { color: '#f97316 !important' },
                      }}
                    >
                      Марка та Модель
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'year'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('year')}
                      className="text-slate-300 font-bold uppercase text-xs hover:text-orange-500"
                      sx={{
                        '&.Mui-active': { color: '#f97316 !important' },
                        '& .MuiTableSortLabel-icon': { color: '#f97316 !important' },
                      }}
                    >
                      Рік
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'owner'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('owner')}
                      className="text-slate-300 font-bold uppercase text-xs hover:text-orange-500"
                      sx={{
                        '&.Mui-active': { color: '#f97316 !important' },
                        '& .MuiTableSortLabel-icon': { color: '#f97316 !important' },
                      }}
                    >
                      Власник
                    </TableSortLabel>
                  </TableCell>

                  <TableCell align="right" className="text-slate-500 font-bold uppercase text-xs">
                    Сервіс
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedVehicles.map((v) => (
                  <VehicleRowItem
                    key={v.id}
                    vehicle={v}
                    ownerName={getOwnerName(v.userId)}
                    onEdit={(vehicle) => {
                      setSelectedVehicle(vehicle);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      <VehicleDialog
        open={isDialogOpen}
        vehicle={selectedVehicle}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchData}
      />
    </Box>
  );
}
