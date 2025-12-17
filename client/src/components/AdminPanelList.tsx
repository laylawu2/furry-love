import useFetch from "../hooks/useFetch";
import type { AdminStats } from "../lib/models";
import styles from "./adminPanel.module.css";
const AdminPanelList = () => {
  const { data: stats, error, loading } = useFetch<AdminStats>("/admin/stats");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats found.</div>;
  /**
 * {
            "id": 1,
            "petId": 1,
            "name": "Rabies",
            "administeredAt": "2023-03-15T00:00:00.000Z",
            "expiresAt": "2026-01-15T08:00:00.000Z",
            "createdAt": "2025-12-16T00:22:45.160Z",
            "pet": {
                "id": 1,
                "name": "Luna",
                "dateOfBirth": "2020-03-15T00:00:00.000Z",
                "type": "DOG",
                "ownerId": 1,
                "createdAt": "2025-12-16T00:22:45.148Z",
                "updatedAt": "2025-12-16T03:56:31.470Z",
                "imageUrl": "https://images.unsplash.com/photo-1543466835-00a7907e9de1"
            }
        }
 */
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
