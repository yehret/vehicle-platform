import { Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { Box, IconButton, TableCell, TableRow } from '@mui/material';
import type { User } from '../types/User';

interface UserRowItemProps {
  user: User;
  onDelete: (id: string) => void;
  onInfo: (user: User) => void;
}

export const UserRowItem = ({ user, onDelete, onInfo }: UserRowItemProps) => {
  return (
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
            className="transition-colors"
            sx={{
              color: '#64748b',
              '&:hover': { color: '#f97316' },
            }}
            onClick={() => onInfo(user)}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            className="transition-colors"
            sx={{
              color: '#64748b',
              '&:hover': { color: '#F93816' },
            }}
            onClick={() => onDelete(user.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};
