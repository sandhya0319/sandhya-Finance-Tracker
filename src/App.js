import './App.css';
import { Routes, Route, Link } from 'react-router-dom'
import FinanceForm from './pages/login/components/FinanceForm';
import ViewFinanceData from './pages/login/components/ViewFinanceData';
import ViewSingleData from './pages/login/components/ViewSingleData';
//import EditForm from './pages/login/components/EditForm';
import LoginPage from './pages/Authentication/components/LoginPage'
import RegisterPage from './pages/Authentication/components/RegisterPage';
import ProtectedRoutes from './Services/ProtectedRoutes';
import UnprotectedRoutes from './Services/UnprotectedRoutes';


function App() {
  return (
    <div className="App">
      <div className='head'>
      <h1>Finance Tracker</h1>
      {/* <nav className='navitems'>
                    <ul>
                      <li>
                        <Link to="/login" className='alink'>login</Link>
                      </li>
                      <li>
                        <Link to="/register" className='alink'>register</Link>
                      </li>
                    </ul>
                </nav> */}
      </div>
     
      <Routes>
        <Route element={<UnprotectedRoutes/>}>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        </Route>
       
        {/* protectedroutes */}
        <Route path='/' element={<ProtectedRoutes />}>
                <Route path='/form' element={<FinanceForm />} />
                <Route path='/form/:id' element={<FinanceForm />} />
                <Route path='/viewdata' element={<ViewFinanceData />} />
                <Route path='/viewsingledata' element={<ViewSingleData />} />
        </Route>
      
       
        {/* <Route path='/updatedata' element={<EditForm />} /> */}
      </Routes>
    </div>
  );
}

export default App;
