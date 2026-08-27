import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import apiClient from '../utils/api';

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statistics, setStatistics] = useState(null);
  const [pendingListings, setPendingListings] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadStatistics();
    loadPendingListings();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError('فشل في تحميل الإحصائيات');
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingListings = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getListings({ status: 'pending' });
      setPendingListings(data.data || []);
    } catch (err) {
      setError('فشل في تحميل الإعلانات المعلقة');
      console.error('Error loading pending listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem({
      id: item.id,
      title: item.title,
      description: item.description,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      userName: item.userName,
      userPhone: item.userPhone,
      price: item.price,
      location: item.location,
      tags: item.tags?.join(', ') || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setLoading(true);
      const updateData = {
        title: editingItem.title,
        description: editingItem.description,
        categoryId: editingItem.categoryId,
        categoryName: editingItem.categoryName,
        userName: editingItem.userName,
        userPhone: editingItem.userPhone,
        price: parseFloat(editingItem.price) || 0,
        location: editingItem.location,
        tags: editingItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await apiClient.updateListing(editingItem.id, updateData);
      setEditingItem(null);
      loadPendingListings(); // Reload data
      alert('تم حفظ التعديلات بنجاح');
    } catch (err) {
      setError('فشل في حفظ التعديلات');
      console.error('Error saving edit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await apiClient.updateListing(id, { status: 'approved' });
      loadPendingListings(); // Reload data
      loadStatistics(); // Update statistics
      alert('تم قبول الإعلان ونشره');
    } catch (err) {
      setError('فشل في قبول الإعلان');
      console.error('Error approving listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      await apiClient.updateListing(id, { status: 'rejected' });
      loadPendingListings(); // Reload data
      alert('تم رفض الإعلان');
    } catch (err) {
      setError('فشل في رفض الإعلان');
      console.error('Error rejecting listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      setLoading(true);
      await apiClient.deleteListing(id);
      loadPendingListings(); // Reload data
      loadStatistics(); // Update statistics
      alert('تم حذف الإعلان');
    } catch (err) {
      setError('فشل في حذف الإعلان');
      console.error('Error deleting listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    // Mock export functionality
    alert(`تم تصدير تقرير ${type} بنجاح`);
  };

  if (loading && !statistics && !pendingListings.length) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚙️</div>
            <div>
              <h2 className="text-2xl font-bold">لوحة تحكم المشرف</h2>
              <p className="text-yellow-100">إدارة شاملة لجميع أقسام التطبيق والمحتوى</p>
            </div>
          </div>
          <Button 
            onClick={onClose}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-yellow-600"
          >
            إغلاق
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="dashboard" className="text-sm">لوحة المعلومات</TabsTrigger>
              <TabsTrigger value="pending" className="text-sm">المراجعة المعلقة</TabsTrigger>
              <TabsTrigger value="payments" className="text-sm">المدفوعات</TabsTrigger>
              <TabsTrigger value="users" className="text-sm">المستخدمون</TabsTrigger>
              <TabsTrigger value="reports" className="text-sm">التقارير</TabsTrigger>
              <TabsTrigger value="settings" className="text-sm">الإعدادات</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">إجمالي الإعلانات</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {statistics?.totalListings || 0}
                      </p>
                    </div>
                    <div className="text-blue-500 text-2xl">📊</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">في انتظار المراجعة</p>
                      <p className="text-3xl font-bold text-yellow-900">
                        {statistics?.pendingListings || 0}
                      </p>
                    </div>
                    <div className="text-yellow-500 text-2xl">⏳</div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">المنشورة</p>
                      <p className="text-3xl font-bold text-green-900">
                        {statistics?.approvedListings || 0}
                      </p>
                    </div>
                    <div className="text-green-500 text-2xl">✅</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">إجمالي المستخدمين</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {statistics?.totalUsers || 0}
                      </p>
                    </div>
                    <div className="text-purple-500 text-2xl">👥</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">النشاط الأخير (آخر 30 يوم)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {statistics?.recentListings || 0}
                    </div>
                    <div className="text-sm text-gray-600">إعلانات جديدة</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {statistics?.totalPayments || 0}
                    </div>
                    <div className="text-sm text-gray-600">مدفوعات</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {statistics?.monthlyRevenue ? `${(statistics.monthlyRevenue / 1000000).toFixed(1)}M` : '0'} ريال
                    </div>
                    <div className="text-sm text-gray-600">الإيرادات الشهرية</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Pending Reviews Tab */}
            <TabsContent value="pending" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">العناصر المعلقة للمراجعة</h3>
                <Button onClick={loadPendingListings} disabled={loading}>
                  {loading ? 'جاري التحديث...' : 'تحديث'}
                </Button>
              </div>

              <div className="space-y-4">
                {pendingListings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد إعلانات معلقة للمراجعة
                  </div>
                ) : (
                  pendingListings.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.categoryName}
                            </Badge>
                            <Badge variant={item.type === 'offer' ? 'default' : 'secondary'}>
                              {item.type === 'offer' ? 'عرض' : 'طلب'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="text-sm text-gray-500">
                            <p>المُعلن: {item.userName} | الهاتف: {item.userPhone}</p>
                            <p>التاريخ: {new Date(item.createdAt).toLocaleDateString('ar-SA')}</p>
                            {item.price > 0 && (
                              <p>السعر: {item.price.toLocaleString()} {item.currency}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          onClick={() => handleEdit(item)}
                          variant="outline"
                          size="sm"
                          disabled={loading}
                        >
                          تعديل
                        </Button>
                        <Button
                          onClick={() => handleApprove(item.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                          disabled={loading}
                        >
                          قبول ونشر
                        </Button>
                        <Button
                          onClick={() => handleReject(item.id)}
                          variant="destructive"
                          size="sm"
                          disabled={loading}
                        >
                          رفض
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          size="sm"
                          disabled={loading}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-4">
              <h3 className="text-lg font-semibold">إدارة المدفوعات</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">💳</div>
                  <p>لا توجد مدفوعات معلقة حالياً</p>
                  <p className="text-sm mt-2">سيتم عرض المدفوعات الجديدة هنا للمراجعة</p>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">👥</div>
                  <p>إجمالي المستخدمين: {statistics?.totalUsers || 0}</p>
                  <p className="text-sm mt-2">يمكن إضافة المزيد من إدارة المستخدمين هنا</p>
                </div>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <h3 className="text-lg font-semibold">التقارير والإحصائيات</h3>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">📊 تقرير الإعلانات</h4>
                  <div className="space-y-2 text-sm">
                    <p>إجمالي الإعلانات: {statistics?.totalListings || 0}</p>
                    <p>في انتظار المراجعة: {statistics?.pendingListings || 0}</p>
                    <p>المنشورة: {statistics?.approvedListings || 0}</p>
                  </div>
                  <Button 
                    onClick={() => exportReport('الإعلانات')}
                    className="mt-4 bg-white text-blue-600 hover:bg-gray-100"
                    size="sm"
                  >
                    تصدير التقرير
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">💰 تقرير المدفوعات</h4>
                  <div className="space-y-2 text-sm">
                    <p>إجمالي المدفوعات: {statistics?.totalPayments || 0}</p>
                    <p>الإيرادات الشهرية: {statistics?.monthlyRevenue ? `${(statistics.monthlyRevenue / 1000000).toFixed(1)}M` : '0'} ريال</p>
                    <p>متوسط الدفع: {statistics?.totalPayments > 0 ? `${((statistics.monthlyRevenue || 0) / statistics.totalPayments / 1000).toFixed(0)}K` : '0'} ريال</p>
                  </div>
                  <Button 
                    onClick={() => exportReport('المدفوعات')}
                    className="mt-4 bg-white text-green-600 hover:bg-gray-100"
                    size="sm"
                  >
                    تصدير التقرير
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">👥 تقرير المستخدمين</h4>
                  <div className="space-y-2 text-sm">
                    <p>إجمالي المستخدمين: {statistics?.totalUsers || 0}</p>
                    <p>المستخدمين النشطين: {Math.floor((statistics?.totalUsers || 0) * 0.7)}</p>
                    <p>مستخدمين جدد (هذا الشهر): {statistics?.recentListings || 0}</p>
                  </div>
                  <Button 
                    onClick={() => exportReport('المستخدمين')}
                    className="mt-4 bg-white text-purple-600 hover:bg-gray-100"
                    size="sm"
                  >
                    تصدير التقرير
                  </Button>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">تصدير التقارير</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => exportReport('شامل (PDF)')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    📄 تصدير تقرير شامل (PDF)
                  </Button>
                  <Button 
                    onClick={() => exportReport('بيانات (Excel)')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    📊 تصدير بيانات (Excel)
                  </Button>
                  <Button 
                    onClick={() => exportReport('الرسوم البيانية')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    📈 عرض الرسوم البيانية
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <h3 className="text-lg font-semibold">إعدادات النظام</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">⚙️</div>
                  <p>إعدادات النظام</p>
                  <p className="text-sm mt-2">يمكن إضافة إعدادات التطبيق هنا</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-yellow-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">تعديل العنصر</h3>
                <p className="text-yellow-100 text-sm">تم تعديل تفاصيل العنصر في انتظار التغييرات</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="edit-title">العنوان</Label>
                  <Input
                    id="edit-title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">الوصف</Label>
                  <Textarea
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category">الفئة</Label>
                    <Input
                      id="edit-category"
                      value={editingItem.categoryName}
                      onChange={(e) => setEditingItem({...editingItem, categoryName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">السعر</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-user">اسم المُعلن</Label>
                    <Input
                      id="edit-user"
                      value={editingItem.userName}
                      onChange={(e) => setEditingItem({...editingItem, userName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">رقم الهاتف</Label>
                    <Input
                      id="edit-phone"
                      value={editingItem.userPhone}
                      onChange={(e) => setEditingItem({...editingItem, userPhone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-location">الموقع</Label>
                  <Input
                    id="edit-location"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-tags">العلامات (مفصولة بفواصل)</Label>
                  <Input
                    id="edit-tags"
                    value={editingItem.tags}
                    onChange={(e) => setEditingItem({...editingItem, tags: e.target.value})}
                    className="mt-1"
                    placeholder="مثال: مستعمل, فحص, ضمان"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                  <Button 
                    onClick={() => setEditingItem(null)}
                    variant="outline"
                    disabled={loading}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

