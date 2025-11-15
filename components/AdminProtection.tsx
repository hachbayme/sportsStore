"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link'; // تأكد من استيراد Link إذا كنت تستخدم Next.js

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // كلمة السر الافتراضية عند أول استخدام
  const DEFAULT_PASSWORD = "admin123";

  useEffect(() => {
    // التحقق من وجود كلمة سر مسجلة
    const savedPassword = localStorage.getItem('adminPassword');
    if (!savedPassword) {
      // إذا لم توجد كلمة سر، نستخدم الافتراضية
      localStorage.setItem('adminPassword', DEFAULT_PASSWORD);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const savedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;
    
    if (password === savedPassword) {
      setIsAuthenticated(true);
      setError('');
      // تخزين حالة المصادقة في الجلسة
      sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError('كلمة السر غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
  };

  // التحقق من المصادقة المخزنة في الجلسة
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        {/* زر الرجوع إلى الصفحة الرئيسية */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center text-amber-400 hover:text-amber-300 transition-colors duration-300 group"
        >
          <svg className="w-5 h-5 ml-1 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          العودة إلى المتجر
        </Link>
        
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-96 backdrop-blur-sm bg-opacity-90">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              الدخول إلى لوحة التحكم
            </h2>
            <p className="text-gray-400 mt-2 text-sm">منطقة إدارة متجر الألبسة الرياضية</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-amber-300 text-sm font-medium mb-2">
                كلمة السر
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/30 text-white placeholder-gray-500 transition-all duration-300"
                placeholder="أدخل كلمة السر"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg hover:shadow-amber-500/20"
            >
              <span className="flex items-center justify-center">
                دخول
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </span>
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
            <p>هذه المنطقة مخصصة للمشرفين فقط</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
}