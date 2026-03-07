import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static" className="mb-8 bg-blue-600">
      <Toolbar className="flex justify-between">
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className="text-white decoration-none font-bold"
        >
          Vehicle Platform
        </Typography>

        <div className="flex gap-4">
          <Button color="inherit" component={Link} to="/users">
            Користувачі
          </Button>
          <Button color="inherit" component={Link} to="/vehicles">
            Транспорт
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Вхід
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
