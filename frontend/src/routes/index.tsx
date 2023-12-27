import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateTemplate from "../Templates/Private";
import PrivateRoute from "../components/PrivateRoute";
import Documents from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NewDocument from "../pages/NewDocument";
import Register from "../pages/Register";
import ValidatePdf from "../pages/ValidatePdf";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verifydocument",
    element: (
      <PrivateTemplate name="Verificar autenticidade do documento">
        <ValidatePdf />
      </PrivateTemplate>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Documents />
      </PrivateRoute>
    ),
  },
  {
    path: "/newdocument",
    element: (
      <PrivateRoute>
        <PrivateTemplate name="Criar documento">
          <NewDocument />
        </PrivateTemplate>
      </PrivateRoute>
    ),
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
