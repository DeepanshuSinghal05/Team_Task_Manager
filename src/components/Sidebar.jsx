import { Link, NavLink } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ projects = [] }) {
  const { logout, showToast, user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains('dark');
    root.classList.toggle('dark', nextIsDark);
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Client logout should always proceed even if API logout fails.
    } finally {
      logout();
      showToast('Logged out successfully', 'info');
    }
  };

  return (
    <aside className="w-full border-b border-slate-800 bg-[#0f1117] px-4 py-4 text-slate-200 md:h-screen md:w-72 md:border-b-0 md:border-r">
      <Link to="/dashboard" className="mb-6 block text-lg font-semibold tracking-tight text-white">TaskFlow</Link>
      <nav className="space-y-1">
        <NavLink to="/dashboard" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-800">Dashboard</NavLink>
        <NavLink to="/projects" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-800">Projects</NavLink>
        {isAdmin && <NavLink to="/projects/new" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-800">New Project</NavLink>}
        <button onClick={toggleTheme} className="mt-2 block w-full rounded-md border border-slate-700 px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800">Toggle theme</button>
      </nav>
      <div className="mt-6 border-t border-slate-800 pt-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Your Projects</p>
        <div className="space-y-1">
          {projects.slice(0, 6).map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="block truncate rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              {project.name}
            </Link>
          ))}
        </div>
      </div>
      <button onClick={handleLogout} className="mt-6 w-full rounded-md border border-slate-700 px-3 py-2 text-left text-sm text-rose-300 hover:bg-slate-800 hover:text-rose-200">
        Logout
      </button>
    </aside>
  );
}
