import { useEffect, useState } from "react";
import { databases, DATABASE_ID, COLLECTION_ID_books } from "./lib/appwrite";
import Books from "./components/Books";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";
import HomePage from "./pages/HomePage";

// Uncomment as you build each page:
// import LandingPage from "./pages/LandingPage";
// import LoginPage   from "./pages/LoginPage";
// import SignupPage  from "./pages/SignupPage";
// import HomePage    from "./pages/HomePage";

export default function App() {
  const [, setDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          
        );
        setDocs(res.documents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/"       element={<LandingPage />} /> */}
          {/* <Route path="/login"  element={<LoginPage />}  /> */}
          {/* <Route path="/signup" element={<SignupPage />} /> */}
        </Routes>

        {/* <div>
          <Books />
        </div> */}
      </Router>
    </ThemeProvider>
  );
}