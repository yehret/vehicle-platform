import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

const UsersPage = () => (
  <h1 className="text-2xl font-bold text-gray-800">Сторінка Користувачів 👥</h1>
);
const VehiclesPage = () => (
  <h1 className="text-2xl font-bold text-gray-800">Сторінка Транспорту 🚗</h1>
);
const LoginPage = () => <h1 className="text-2xl font-bold text-gray-800">Сторінка Логіну 🔐</h1>;

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />

          <Route path="/users" element={<UsersPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
