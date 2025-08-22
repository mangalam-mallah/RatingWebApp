import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/signup.jsx";
import Navbar from "./components/navbar.jsx";
import GetProfile from './pages/getProfile.jsx'
import Homepage from './pages/homepage.jsx'
import StoreDetail from './pages/storeDetail.jsx'
import AdminDashboard from './pages/userManagement.jsx'

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard/>
          </ProtectedRoute>
        }
        />
        <Route path="/user/:id" element={<GetProfile />} />
        <Route path="/" element={<Homepage />}/>
        <Route path="/store/:id" element={<StoreDetail/>}/>
      </Routes>
    </Router>
  );
}

export default App;
