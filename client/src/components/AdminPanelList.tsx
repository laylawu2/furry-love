import useFetch from "../hooks/useFetch";
import type { AdminStats } from "../lib/models";
import styles from "./adminPanel.module.css";
const AdminPanelList = () => {
  const { data: stats, error, loading } = useFetch<AdminStats>("/admin/stats");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats found.</div>;

  return (
    <div>
      <div className={styles.panelContainer}>
        <div className={styles.panel}>
          <h1>{stats.totalPets}</h1>
          <label>Total Pets</label>
        </div>

        {stats.petsByType.map((pet) => {
          return (
            <div className={styles.panel} key={pet.type}>
              <h1>{pet._count.type}</h1>
              <label>{pet.type}</label>
            </div>
          );
        })}
      </div>
      <h3>Upcoming Vaccinations</h3>
      {stats.upcomingVaccinations.map((vac) => {
        return (
          <dl className={styles.listView}>
            <dt>Pet Name</dt>
            <dd>{vac.pet.name}</dd>
            <dt>Vaccine Name</dt>
            <dd>{vac.name}</dd>
            <dt>Expires on</dt>
            <dd>{new Date(vac.expiresAt).toLocaleDateString()}</dd>
          </dl>
        );
      })}
    </div>
  );
};

export default AdminPanelList;
