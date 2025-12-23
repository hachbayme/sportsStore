"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Eye, Download, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient";


interface Order {
  id: number
  customername: string
  customerphone: string
  customeremail?: string
  customeraddress: string
  total: number
  status: string
  createdat: string
  items?: OrderItem[]
}

interface OrderItem {
  id: number
  productname: string
  productbrand: string
  productprice: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

const statusColors = {
  PENDING: "text-amber-300 bg-amber-500/20 border-amber-500/30",
  CONFIRMED: "text-blue-300 bg-blue-500/20 border-blue-500/30",
  SHIPPED: "text-orange-300 bg-orange-500/20 border-orange-500/30",
  DELIVERED: "text-green-300 bg-green-500/20 border-green-500/30",
  CANCELLED: "text-red-300 bg-red-500/20 border-red-500/30"
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStatus, setActiveStatus] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, activeStatus])

  const deleteOrder = async (orderId: number) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Commande supprimée avec succès")
        setOrders(orders.filter(order => order.id !== orderId))
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      console.log('Error deleting order:', error)
      toast.error("Erreur lors de la suppression de la commande")
    }
  }

  const confirmDelete = (order: Order) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la commande #${order.id} pour le client ${order.customername} ?`)) {
      deleteOrder(order.id)
    }
  }



const fetchOrders = async () => {
  setLoading(true);

  try {
    // 1️⃣ جلب الطلبات
    const { data: ordersData, error: ordersError } = await supabase
      .from("order")
      .select("*")
      .order("createdat", { ascending: false });

    if (ordersError) throw ordersError;

    // 2️⃣ جلب العناصر المرتبطة بالطلبات
    const { data: itemsData, error: itemsError } = await supabase
      .from("orderitem")
      .select("*");

    if (itemsError) throw itemsError;

    // 3️⃣ ربط كل طلب بعناصره
    const ordersWithItems = ordersData.map(order => ({
      ...order,
      items: itemsData.filter(item => item.orderid === order.id)
    }));

    // 4️⃣ تحديث الحالة
    setOrders(ordersWithItems);

  } catch (err) {
    console.log(err);
    toast.error("Erreur lors du chargement des commandes");
  } finally {
    setLoading(false);
  }
};



  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerphone.includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
      )
    }
  
    if (activeStatus !== "all") {
      filtered = filtered.filter(order => order.status === activeStatus)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Statut de la commande mis à jour avec succès")
        fetchOrders()
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.log('Error updating order:', error)
      toast.error("Erreur lors de la mise à jour du statut de la commande")
    }
  }

  const getStatusDisplay = (status: string) => {
    const statusConfig = {
      PENDING: { label: "En attente", icon: Clock },
      CONFIRMED: { label: "Confirmé", icon: Package },
      SHIPPED: { label: "Expédié", icon: Truck },
      DELIVERED: { label: "Livré", icon: CheckCircle },
      CANCELLED: { label: "Annulé", icon: XCircle }
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  const getTotalOrders = () => orders.length
  const getTotalRevenue = () => orders.reduce((total, order) => total + order.total, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">Gestion des Commandes</h1>
              <p className="text-gray-400 mt-2">Afficher et modifier le statut des commandes</p>
            </div>
            
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total des commandes</p>
                  <p className="text-2xl font-bold text-amber-400">{getTotalOrders()}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <Package className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Revenu total</p>
                  <p className="text-2xl font-bold text-amber-400">{getTotalRevenue()} DH</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Commandes en attente</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {orders.filter(o => o.status === 'PENDING').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher par nom, téléphone ou numéro de commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                />
              </div>
              
              <Select value={activeStatus} onValueChange={setActiveStatus}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white focus:border-amber-500">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all" className="focus:bg-gray-700">Toutes les commandes</SelectItem>
                  <SelectItem value="PENDING" className="focus:bg-gray-700">En attente</SelectItem>
                  <SelectItem value="CONFIRMED" className="focus:bg-gray-700">Confirmé</SelectItem>
                  <SelectItem value="SHIPPED" className="focus:bg-gray-700">Expédié</SelectItem>
                  <SelectItem value="DELIVERED" className="focus:bg-gray-700">Livré</SelectItem>
                  <SelectItem value="CANCELLED" className="focus:bg-gray-700">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusDisplay(order.status)
            const StatusIcon = statusConfig.icon
            
            return (
              <Card key={order.id} className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-500/30">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Package className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">Commande #{order.id}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {new Date(order.createdat).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${statusColors[order.status as keyof typeof statusColors]}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-amber-400 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Informations client
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nom:</span>
                          <span className="font-medium text-white">{order.customername}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Téléphone:</span>
                          <span className="font-medium text-white">{order.customerphone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="font-medium text-white">{order.customeremail || "Non disponible"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Adresse:</span>
                          <span className="font-medium text-white text-left max-w-[200px]">{order.customeraddress}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-amber-400">Produits ({order.items?.length || 0})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                       {order.items?.map((item) => (
                          <div key={item.id} className="flex justify-between items-start p-2 bg-gray-700/50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-white">{item.productname}</p>
                              <p className="text-xs text-gray-400">{item.productbrand}</p>
                              {item.selectedSize && (
                                <p className="text-xs text-gray-500">Taille: {item.selectedSize}</p>
                              )}
                              {item.selectedColor && (
                                <p className="text-xs text-gray-500">Couleur: {item.selectedColor}</p>
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-gray-300">{item.quantity} × {item.productprice} DH</p>
                              <p className="font-medium text-sm text-amber-400">{item.quantity * item.productprice} DH</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-700">
                    <div className="text-lg font-bold text-amber-400">
                      Total: {order.total} DH
                    </div>

                    <div className="flex items-center gap-3">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white focus:border-amber-500">
                          <SelectValue placeholder="Changer le statut" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="PENDING" className="focus:bg-gray-700">En attente</SelectItem>
                          <SelectItem value="CONFIRMED" className="focus:bg-gray-700">Confirmé</SelectItem>
                          <SelectItem value="SHIPPED" className="focus:bg-gray-700">Expédié</SelectItem>
                          <SelectItem value="DELIVERED" className="focus:bg-gray-700">Livré</SelectItem>
                          <SelectItem value="CANCELLED" className="focus:bg-gray-700">Annulé</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200"
                      >
                        Détails
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => confirmDelete(order)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Aucune commande</h3>
            <p className="text-gray-500">
              {searchTerm || activeStatus !== "all" 
                ? "Aucune commande trouvée correspondant à votre recherche" 
                : "Aucune commande pour le moment"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}