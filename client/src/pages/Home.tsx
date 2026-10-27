import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      {<Outlet />}
    </div>
  );
};

export default Home;
