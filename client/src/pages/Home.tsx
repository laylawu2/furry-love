import PetList from "../components/PetList";
import { Link } from "react-router";

const Home = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h1>Welcome to Furry Love</h1>
        {/** Check user role - only show link if user is admin */}
        <Link to="/admin/stats">Admin Dashboard</Link>
      </div>
      <PetList />
    </div>
  );
};

export default Home;
