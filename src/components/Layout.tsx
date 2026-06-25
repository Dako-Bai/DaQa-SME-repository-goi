import { ReactNode } from 'react';
import Header from './Header';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-transparent font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col transition-colors duration-300">
      <Header />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <main className="flex-1 pt-24 grid relative">
          <div className="relative z-10 w-full">
            {children}
          </div>
        </main>
        <footer className="py-8 mt-12 bg-white/10 dark:bg-black/20 border-t border-white/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} SmartME Mercury Energy. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
               <a href="#" className="hover:text-amber-400 transition">Contact Us</a>
               <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
               <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
