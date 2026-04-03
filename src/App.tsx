import { useContext } from "react";
import { Loader, NavBar } from "./components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/currentUserContext";
import { DashboardPage, UserItems } from "./pages";

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
          <Route path="/user-items/:userId" element={<UserItems />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
