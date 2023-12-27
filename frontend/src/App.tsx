import "react-toastify/dist/ReactToastify.css";
import CustomToastContainer from "./components/CustomToastContainer";
import Providers from "./context/Providers";
import Routes from "./routes";

const App = () => {
  return (
    <Providers>
      <Routes />
      <CustomToastContainer />
    </Providers>
  );
};

export default App;
