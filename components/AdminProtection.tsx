// "use client"

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// interface AdminProtectionProps {
//   children: React.ReactNode;
// }

// export default function AdminProtection({ children }: AdminProtectionProps) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   // Mot de passe par défaut pour la première utilisation
//   const DEFAULT_PASSWORD = "admin123";

//   useEffect(() => {
//     // Vérifier si un mot de passe est enregistré
//     const savedPassword = localStorage.getItem('adminPassword');
//     if (!savedPassword) {
//       // Si aucun mot de passe n'existe, utiliser le mot de passe par défaut
//       localStorage.setItem('adminPassword', DEFAULT_PASSWORD);
//     }
//   }, []);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const savedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;
    
//     if (password === savedPassword) {
//       setIsAuthenticated(true);
//       setError('');
//       // Stocker l'état d'authentification dans la session
//       sessionStorage.setItem('adminAuthenticated', 'true');
//     } else {
//       setError('Mot de passe incorrect');
//     }
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     sessionStorage.removeItem('adminAuthenticated');
//   };

//   // Vérifier l'authentification stockée dans la session
//   useEffect(() => {
//     const savedAuth = sessionStorage.getItem('adminAuthenticated');
//     if (savedAuth === 'true') {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
//         {/* Bouton de retour à la page d'accueil */}
//         <Link 
//           href="/" 
//           className="absolute top-6 left-6 flex items-center text-amber-400 hover:text-amber-300 transition-colors duration-300 group"
//         >
//           <svg className="w-5 h-5 ml-1 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//           </svg>
//           Retour à la boutique
//         </Link>
        
//         <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-96 backdrop-blur-sm bg-opacity-90">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
//               Accès au panneau d'administration
//             </h2>
//             <p className="text-gray-400 mt-2 text-sm">Zone d'administration de la boutique de vêtements de sport</p>
//           </div>
          
//           <form onSubmit={handleLogin}>
//             <div className="mb-6">
//               <label className="block text-amber-300 text-sm font-medium mb-2">
//                 Mot de passe
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/30 text-white placeholder-gray-500 transition-all duration-300"
//                 placeholder="Entrez le mot de passe"
//                 required
//               />
//             </div>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center">
//                 <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//                 {error}
//               </div>
//             )}
            
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg hover:shadow-amber-500/20"
//             >
//               <span className="flex items-center justify-center">
//                 Se connecter
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
//                 </svg>
//               </span>
//             </button>
//           </form>
          
//           <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
//             <p>Cette zone est réservée aux administrateurs uniquement</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {children}
//     </div>
//   );
// }

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface AdminProtectionProps {
  children: React.ReactNode
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // التحقق من الجلسة
  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuthenticated")
    if (auth === "true") setIsAuthenticated(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erreur de connexion")
        setLoading(false)
        return
      }

      // تسجيل دخول ناجح
      sessionStorage.setItem("adminAuthenticated", "true")
      setIsAuthenticated(true)
    } catch {
      setError("Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <Link
          href="/"
          className="absolute top-6 left-6 text-amber-400 hover:text-amber-300"
        >
          ← Retour à la boutique
        </Link>

        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-96">
          <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
            Accès Admin
          </h2>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg"
            />

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 rounded-lg text-white hover:bg-amber-600"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
