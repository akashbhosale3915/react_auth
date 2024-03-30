import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Otp from './components/Otp';

const App = () => {
  const isUserLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  console.log(isUserLoggedIn, 'isUserLoggedIn');

  return (
    <Routes>
      <Route
        path='/login'
        element={
          isUserLoggedIn ? (
            <Navigate to='/dashboard' />
          ) : (
            <Home>
              <Login />
            </Home>
          )
        }
      />
      <Route
        path='/signup'
        element={
          isUserLoggedIn ? (
            <Navigate to='/dashboard' />
          ) : (
            <Home>
              <Signup />
            </Home>
          )
        }
      />
      <Route
        path='/dashboard'
        element={isUserLoggedIn ? <Dashboard /> : <Navigate to='/login' />}
      />
      <Route
        path='/otp'
        element={
          isUserLoggedIn ? (
            <Dashboard />
          ) : (
            <Home>
              <Otp />
            </Home>
          )
        }
      />
    </Routes>
  );
};

export default App;
