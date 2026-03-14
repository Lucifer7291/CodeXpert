import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">

      <Header />

      <main className="flex-grow container mx-auto">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;