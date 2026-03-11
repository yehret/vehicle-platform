import {
  DirectionsCar as CarIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" className="mb-8 bg-slate-950 border-b border-slate-800 shadow-none">
      <Toolbar className="flex justify-between max-w-7xl mx-auto w-full">
        <Box
          component={Link}
          to="/"
          className="flex items-center gap-2 text-white no-underline hover:opacity-80 transition-opacity"
        >
          <div className="bg-orange-500 p-1.5 rounded-lg flex items-center justify-center">
            <CarIcon className="text-slate-950" />
          </div>
          <Typography variant="h6" className="font-black tracking-tighter uppercase italic">
            VEHICLE<span className="text-orange-500">SERVICE</span>
          </Typography>
        </Box>

        <Box className="flex items-center gap-2">
          {user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/users"
                startIcon={<PeopleIcon className="text-slate-400" />}
                className="capitalize font-semibold hover:text-orange-400"
              >
                Клієнти
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/vehicles"
                startIcon={<CarIcon className="text-slate-400" />}
                className="capitalize font-semibold hover:text-orange-400"
              >
                Транспорт
              </Button>
            </>
          )}

          <Box className="ml-4 flex items-center gap-4 pl-4 border-l border-slate-800">
            {user ? (
              <Box className="flex items-center gap-3">
                <Box className="text-right sm:block flex! flex-col">
                  <Typography variant="body2" className="text-white font-bold leading-none">
                    {user.firstName || 'Адмін'}
                  </Typography>
                  <Typography variant="caption" className="text-slate-500">
                    Менеджер
                  </Typography>
                </Box>

                <Tooltip title="Налаштування профілю">
                  <Avatar
                    sx={{ width: 35, height: 35, bgcolor: 'orange.500', color: 'black' }}
                    className="cursor-pointer border-2 border-slate-700"
                  >
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </Avatar>
                </Tooltip>

                <IconButton
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              ''
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
