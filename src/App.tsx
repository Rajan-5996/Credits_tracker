import { useContext } from "react";
import { Loader, NavBar } from "./components";
import DashboardPage from "./pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/currentUserContext";

function App() {
  const user_context = useContext(UserContext);

  if (user_context?.loading) {
    return (
      <Loader />
    )
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
