import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Mic2, FileText, User, PlusCircle, LogOut, Menu, X, Wallet, Heart } from 'lucide-react';
import { AuthService } from '../services/authService';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'خانه', icon: <Home size={20} /> },
    { path: '/manqabat', label: 'منقبت', icon: <FileText size={20} /> },
    { path: '/add', label: 'افزودن', icon: <PlusCircle size={28} />, isFab: true },
    { path: '/speeches', label: 'سخنرانی', icon: <Mic2 size={20} /> },
    { path: '/profile', label: 'پروفایل', icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-primary-800 text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <Link to="/" className="text-xl font-bold tracking-wider">فراشان مدیا</Link>
           <div className="flex gap-4">
             {navItems.filter(i => !i.isFab).map(item => (
               <Link 
                 key={item.path} 
                 to={item.path}
                 className={`px-3 py-2 rounded-md transition-colors ${isActive(item.path) ? 'bg-primary-700 font-bold' : 'hover:bg-primary-700'}`}
               >
                 {item.label}
               </Link>
             ))}
             {/* Desktop 'Add' Button */}
             <Link 
                to="/add"
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${isActive('/add') ? 'bg-amber-500 text-white' : 'bg-white text-primary-800 hover:bg-gray-100'}`}
             >
                <PlusCircle size={18} />
                افزودن پست
             </Link>
           </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               {user.role !== UserRole.USER && (
                 <Link to="/admin" className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">پنل مدیریت</Link>
               )}
               <span className="text-sm opacity-90">سلام، {user.name}</span>
               <button onClick={handleLogout} className="p-2 hover:bg-primary-700 rounded-full" title="خروج">
                 <LogOut size={20} />
               </button>
            </div>
          ) : (
            <Link to="/login" className="bg-primary-600 px-4 py-2 rounded hover:bg-primary-500 transition">ورود / ثبت نام</Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Sticky Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            if (item.isFab) {
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className="relative -top-5 bg-primary-600 text-white p-4 rounded-full shadow-lg border-4 border-gray-50 transform transition active:scale-95"
                >
                  {item.icon}
                </Link>
              );
            }
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-primary-600' : 'text-gray-400'}`}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;