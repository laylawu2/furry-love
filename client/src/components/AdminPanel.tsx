import useFetch from "../hooks/useFetch";

const AdminPanel = () => {
  const {
    data: stats,
    error,
    loading
  } = useFetch("/admin/stats");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats found.</div>;

  console.log("stats", stats);
  return <></>;
};

export default AdminPanel;
