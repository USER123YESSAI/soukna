import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { getErrorMessage } from '../../services/api';
import { downloadCsvBlob } from '../../utils/csvExporter';
import toast from 'react-hot-toast';
import { Download, CheckCircle2, Ban } from 'lucide-react';

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
      <PageHeader
        title="Gestion des utilisateurs"
        subtitle="Consultez, filtrez et modérez l'ensemble des comptes de la plateforme"
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            loading={exporting}
            iconLeft={<Download size={15} />}
          >
            Exporter tous les utilisateurs (CSV)
          </Button>
        }
      />

      <div className="mb-5 max-w-xs">
        <Select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
        >
          <option value="">Tous les rôles ({pagination?.total ?? '...'})</option>
          <option value="buyer">Acheteurs uniquement</option>
          <option value="seller">Vendeurs uniquement</option>
          <option value="admin">Administrateurs</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          <Card padding={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Utilisateur</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rôle</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Statut</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'seller' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={u.suspended_at ? 'suspended' : 'active'} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.role !== 'admin' && (
                          <Button
                            variant={u.suspended_at ? 'outline' : 'danger'}
                            size="sm"
                            onClick={() => toggleSuspend(u)}
                            iconLeft={u.suspended_at ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                          >
                            {u.suspended_at ? 'Réactiver' : 'Suspendre'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-6">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return <AdminUsers />;
}
