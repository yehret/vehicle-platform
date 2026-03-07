import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/vehicles" element={<div>Сторінка авто (в розробці)</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
