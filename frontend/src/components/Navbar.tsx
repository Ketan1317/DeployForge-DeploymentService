import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#000]/80 backdrop-blur-md text-white font-sans">
      <div className="mx-auto max-w-7xl px-[4vw] md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black uppercase tracking-wider text-white">
            ⚡ Deploy<span className="text-white/60">Forge</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold uppercase tracking-wider text-white/75 hover:text-white transition-colors duration-200"
          >
            GitHub
          </a>
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.username}
                className="h-8 w-8 rounded-full border border-white/20 object-cover"
              />
            )}
            <span className="hidden sm:inline text-sm font-bold text-white/90">{user.username}</span>
            <button
              className="bg-white/10 hover:bg-white hover:text-black border border-transparent text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none transition-all duration-200 cursor-pointer active:scale-95"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
