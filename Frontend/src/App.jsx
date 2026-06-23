import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContet.jsx';
import { ProtectedRoute, AdminRoute } from './protectedRoute/protectedRoute.jsx';

// Public
import Home from './Components/Home';

// User auth
import Login from './User/Login';
import Signup from './User/Signup';

// User app (protected)
import Uhome from './User/Uhome';
import ChargingStations from './User/ChargeStaions';
import BookSlot from './User/BookSlot';
import Pricing from './User/Pricing';
import Mybookings from './User/Mybookings';

// Admin auth
import Alogin from './Admin/Alogin';
import Asignup from './Admin/Asingup';

// Admin app (protected)
import Ahome from './Admin/Ahome';
import Users from './Admin/Users';
import EditUser from './Admin/EditUser';
import Achargepoints from './Admin/Achargepoints';
import Addchargestaion from './Admin/Addchargestation';
import Editchargestation from './Admin/Editchargestation';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/alogin" element={<Alogin />} />
          <Route path="/asignup" element={<Asignup />} />
          <Route path="/uhome" element={<ProtectedRoute><Uhome /></ProtectedRoute>} />
          <Route path="/chargestation" element={<ProtectedRoute><ChargingStations /></ProtectedRoute>} />
          <Route path="/bookslot/:id" element={<ProtectedRoute><BookSlot /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
          <Route path="/mybookings" element={<ProtectedRoute><Mybookings /></ProtectedRoute>} />
          <Route path="/ahome" element={<AdminRoute><Ahome /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/edituser/:id" element={<AdminRoute><EditUser /></AdminRoute>} />
          <Route path="/achargepoints" element={<AdminRoute><Achargepoints /></AdminRoute>} />
          <Route path="/addchargestation" element={<AdminRoute><Addchargestaion /></AdminRoute>} />
          <Route path="/editchargestation/:id" element={<AdminRoute><Editchargestation /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}




export default App;