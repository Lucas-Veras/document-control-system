import "react-toastify/dist/ReactToastify.css";
import CustomToastContainer from "./components/CustomToastContainer";
import Routes from "./routes";

const App = () => {
  return (
    <>
      <Routes />
      <CustomToastContainer />
    </>
  );
};

export default App;
