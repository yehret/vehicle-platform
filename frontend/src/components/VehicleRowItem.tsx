import { Settings as SettingsIcon } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import type { Vehicle } from '../types/Vehicle';

interface VehicleRowItemProps {
  vehicle: Vehicle;
  ownerName: string;
  onEdit: (vehicle: Vehicle) => void;
}

export const VehicleRowItem = ({ vehicle, ownerName, onEdit }: VehicleRowItemProps) => {
  return (
    <TableRow key={vehicle.id} className="hover:bg-slate-800/30 transition-colors">
      <TableCell className="font-mono text-[10px] text-slate-600">
        #{vehicle.id.split('-')[0]}
      </TableCell>

      <TableCell>
        <Typography className="text-white font-black text-lg uppercase tracking-tight">
          {vehicle.make} <span className="text-orange-500">{vehicle.model}</span>
        </Typography>
      </TableCell>

      <TableCell>
        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
          {vehicle.year ? vehicle.year : 'N/A'}
        </span>
      </TableCell>

      <TableCell>
        <Typography variant="body2" className="text-slate-300 font-bold">
          {ownerName}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <IconButton
          onClick={() => onEdit(vehicle)}
          className="transition-colors"
          sx={{
            color: '#64748b',
            '&:hover': { color: '#f97316' },
          }}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
