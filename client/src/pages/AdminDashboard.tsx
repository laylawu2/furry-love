import AdminPanelList from "../components/AdminPanelList";
import BackButton from "../components/BackButton";

const AdminDashboard = () => {
  return (
    <div>
      <BackButton />
      <h2>Admin Dashboard Page</h2>
      <AdminPanelList />
    </div>
  );
};

export default AdminDashboard;
