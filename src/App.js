import "./App.css";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import FinanceForm from "./pages/login/components/FinanceForm";
import ViewFinanceData from "./pages/login/components/ViewFinanceData";
import ViewSingleData from "./pages/login/components/ViewSingleData";
//import EditForm from './pages/login/components/EditForm';
import LoginPage from "./pages/Authentication/components/LoginPage";
import RegisterPage from "./pages/Authentication/components/RegisterPage";
import ProtectedRoutes from "./Services/ProtectedRoutes";
import UnprotectedRoutes from "./Services/UnprotectedRoutes";
import { Transactioncontext } from "./pages/contexts/Transactioncontext";




const FinalRoute = (props) => {
  const authtoken = localStorage.getItem("loggedintoken");

  
  const ispublic = props.ispublic;
  const component = props.component;
  if (ispublic) {
    if (!authtoken) {
      return component;
    } else {
      return <Navigate to={"/viewdata"} />;
    }
  } else {
    if (authtoken) {
      return component;
    } else {
      return <Navigate to={"/login"} />;
    }
  }
};
// export const TableContext=createContext();
function App() {
  return (
    <div className="App">
      <div className="head">
        <h1>Finance Tracker</h1>
      </div>
      <Transactioncontext>
        <Routes>
          {/* <Route element={<UnprotectedRoutes />}>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

 
          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="form" element={<FinanceForm />} />
            <Route path="/form/:id" element={<FinanceForm />} />
            <Route path="/viewdata" element={<ViewFinanceData />} />
            <Route path="/viewsingledata" element={<ViewSingleData />} />
          </Route> */}
          <Route path="/">
            <Route path="" element={<Navigate to={`/viewdata`} />} />

            <Route
              path="register"
              element={
                <FinalRoute ispublic={true} component={<RegisterPage />} />
              }
            />
            <Route
              path="login"
              element={<FinalRoute ispublic={true} component={<LoginPage />} />}
            />
            <Route
              path="form"
              element={<FinalRoute component={<FinanceForm />} />}
            />
            <Route
              path="form:id"
              element={<FinalRoute component={<FinanceForm />} />}
            />
            <Route
              path="viewdata"
              element={<FinalRoute component={<ViewFinanceData />} />}
            />
            <Route
              path="viewsingledata"
              element={<FinalRoute component={<ViewSingleData />} />}
            />
          </Route>
        </Routes>
      </Transactioncontext>
    </div>
  );
}

export default App;
