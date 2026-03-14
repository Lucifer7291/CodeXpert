import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Tutorials from "./pages/Tutorials";
import Notes from "./pages/Notes";
import Roadmaps from "./pages/Roadmaps";
import Quiz from "./pages/Quiz";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/projects" element={<Projects />} />

        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;