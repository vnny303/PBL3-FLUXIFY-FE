import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
