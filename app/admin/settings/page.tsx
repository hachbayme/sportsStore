"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shield, Save, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Vérification des entrées
    if (newPassword !== confirmPassword) {
      toast.error("Le nouveau mot de passe ne correspond pas")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      setIsLoading(false)
      return
    }

    try {
      // Ici, la requête sera envoyée au serveur pour changer le mot de passe
      // Dans cet exemple, nous utiliserons localStorage pour le stockage local
      const storedPassword = localStorage.getItem('adminPassword')
      
      if (storedPassword !== currentPassword) {
        toast.error("Le mot de passe actuel est incorrect")
        setIsLoading(false)
        return
      }

      // Changer le mot de passe
      localStorage.setItem('adminPassword', newPassword)
      toast.success("Mot de passe changé avec succès")
      
      // Effacer les champs
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error("Erreur lors du changement du mot de passe")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-amber-400">Paramètres Admin</h1>
        </div>
        
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription className="text-gray-400">
              Mettez à jour le mot de passe de votre compte admin pour garantir la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-300">
                  Mot de passe actuel
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 pr-10"
                    required
                    placeholder="Entrez le mot de passe actuel"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-amber-400"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 pr-10"
                    required
                    placeholder="Entrez le nouveau mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-amber-400"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirmer le nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 pr-10"
                    required
                    placeholder="Ressaisissez le nouveau mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-amber-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-300"></div>
                      Sauvegarde en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Changer le mot de passe
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}