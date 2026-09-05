import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { getErrorMessage } from '../../services/api';
import { downloadCsvBlob } from '../../utils/csvExporter';
import toast from 'react-hot-toast';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
  const [exporting, setExporting] = useState(false);

  const load = () => {
    setLoading(true);
    const params = { page };
    if (role) params.role = role;
    adminService
      .getUsers(params)
      .then(({ data }) => {
        setUsers(data.data || []);
        setPagination(data.pagination);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, role]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const res = await adminService.exportUsersCsv();
      downloadCsvBlob(res.data, `utilisateurs_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('Fichier CSV exporté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export : ' + getErrorMessage(error));
    } finally {
      setExporting(false);
    }
  };

  const toggleSuspend = async (user) => {
    try {
      if (user.suspended_at) {
        await adminService.activateUser(user.id);
        toast.success('Utilisateur réactivé');
      } else {
        await adminService.suspendUser(user.id);
        toast.success('Utilisateur suspendu');
      }
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          {exporting ? 'Téléchargement...' : '📥 Exporter tous les utilisateurs (CSV)'}
        </button>
      </div>

      <select
        value={role}
        onChange={(e) => { setRole(e.target.value); setPage(1); }}
        className="mb-4 rounded-lg border px-3 py-2 text-sm"
      >
        <option value="">Tous les rôles</option>
        <option value="buyer">Acheteurs</option>
        <option value="seller">Vendeurs</option>
        <option value="admin">Admins</option>
      </select>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Rôle</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.suspended_at ? 'Suspendu' : 'Actif'}</td>
                    <td className="p-3">
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => toggleSuspend(u)}
                          className={`text-sm ${u.suspended_at ? 'text-green-600' : 'text-red-600'} hover:underline`}
                        >
                          {u.suspended_at ? 'Réactiver' : 'Suspendre'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return <AdminUsers />;
}
