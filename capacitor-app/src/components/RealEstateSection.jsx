import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Home, 
  Building, 
  MapPin, 
  DollarSign,
  Plus,
  Search,
  Eye,
  Phone,
  User,
  Clock
} from 'lucide-react'

const RealEstateSection = () => {
  const [activeSubTab, setActiveSubTab] = useState('properties')
  const [formData, setFormData] = useState({
    type: '',
    propertyType: '',
    title: '',
    description: '',
    price: '',
    area: '',
    location: '',
    floors: '',
    rooms: '',
    phone: '',
    ownerName: ''
  })

  // بيانات وهمية للعرض
  const sampleProperties = [
    {
      id: 1,
      type: 'عرض',
      propertyType: 'فيلا',
      title: 'فيلا فاخرة في حي الصافية',
      description: 'فيلا من دورين، 5 غرف نوم، 3 حمامات، حديقة واسعة',
      price: '150000000',
      area: '400',
      location: 'صنعاء - حي الصافية',
      floors: '2',
      rooms: '5',
      phone: '777123456',
      ownerName: 'أحمد محمد',
      status: 'قيد المراجعة'
    },
    {
      id: 2,
      type: 'طلب',
      propertyType: 'شقة',
      title: 'مطلوب شقة للإيجار',
      description: 'أبحث عن شقة 3 غرف في منطقة هادئة',
      price: '80000',
      area: '150',
      location: 'عدن - كريتر',
      floors: '1',
      rooms: '3',
      phone: '777654321',
      ownerName: 'فاطمة علي',
      status: 'منشور'
    }
  ]

  const sampleRequests = [
    {
      id: 1,
      type: 'طلب',
      propertyType: 'أرض',
      title: 'مطلوب أرض للبناء',
      description: 'أبحث عن أرض مساحة 300-500 متر للبناء',
      priceRange: '50000000-80000000',
      location: 'تعز',
      phone: '777111222',
      clientName: 'محمد أحمد',
      status: 'منشور'
    }
  ]

  const propertyTypes = [
    { value: 'land', label: 'أرض' },
    { value: 'building', label: 'عمارة' },
    { value: 'villa', label: 'فيلا' },
    { value: 'apartment', label: 'شقة' },
    { value: 'house', label: 'منزل' },
    { value: 'commercial', label: 'تجاري' },
    { value: 'office', label: 'مكتب' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Real Estate Form submitted:', formData)
    alert('تم إرسال طلبك بنجاح! سيتم مراجعته من قبل المشرف قبل النشر.')
    setFormData({
      type: '',
      propertyType: '',
      title: '',
      description: '',
      price: '',
      area: '',
      location: '',
      floors: '',
      rooms: '',
      phone: '',
      ownerName: ''
    })
  }

  const renderPropertyCard = (property) => (
    <Card key={property.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Home className="h-5 w-5 text-blue-600" />
              <span>{property.title}</span>
            </CardTitle>
            <CardDescription className="mt-1">{property.description}</CardDescription>
          </div>
          <Badge variant={property.type === 'عرض' ? 'default' : 'secondary'}>
            {property.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">نوع العقار:</span>
            <span className="text-sm font-medium">{property.propertyType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">السعر:</span>
            <span className="text-sm font-medium text-green-600">
              {parseInt(property.price).toLocaleString()} ريال
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">المساحة:</span>
            <span className="text-sm font-medium">{property.area} م²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">الموقع:</span>
            <span className="text-sm font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {property.location}
            </span>
          </div>
          {property.rooms && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">عدد الغرف:</span>
              <span className="text-sm font-medium">{property.rooms}</span>
            </div>
          )}
          {property.floors && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">عدد الأدوار:</span>
              <span className="text-sm font-medium">{property.floors}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">المالك:</span>
            <span className="text-sm font-medium">{property.ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">الحالة:</span>
            <Badge variant={property.status === 'منشور' ? 'default' : 'outline'}>
              {property.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button size="sm" variant="outline" className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>عرض</span>
            </Button>
            <Button size="sm" className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>اتصال</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Home className="h-5 w-5 text-green-600" />
            </div>
            <span>التسويق العقاري</span>
          </CardTitle>
          <CardDescription>
            منصة متخصصة للتسويق العقاري مع نظام مراجعة متقدم لحماية العمولة
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">العقارات المعروضة</TabsTrigger>
          <TabsTrigger value="requests">طلبات العملاء</TabsTrigger>
          <TabsTrigger value="add-property">إضافة عقار</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="البحث في العقارات..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offer">عرض</SelectItem>
                <SelectItem value="request">طلب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleProperties.map(renderPropertyCard)}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">طلبات العملاء للشراء</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <User className="h-5 w-5 text-orange-600" />
                        <span>{request.title}</span>
                      </CardTitle>
                      <Badge variant="secondary">طلب</Badge>
                    </div>
                    <CardDescription>{request.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">نوع العقار:</span>
                        <span className="text-sm font-medium">{request.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">المدى السعري:</span>
                        <span className="text-sm font-medium text-green-600">
                          {request.priceRange} ريال
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الموقع:</span>
                        <span className="text-sm font-medium">{request.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">اسم العميل:</span>
                        <span className="text-sm font-medium">{request.clientName}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <Button size="sm" variant="outline" className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>عرض</span>
                        </Button>
                        <Button size="sm" className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>اتصال</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="add-property">
          <Card>
            <CardHeader>
              <CardTitle>إضافة عقار جديد</CardTitle>
              <CardDescription>
                املأ النموذج أدناه لإضافة عقار. سيتم مراجعة الطلب من قبل المشرف قبل النشر لضمان حماية العمولة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">نوع الإعلان</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">مالك العقار</SelectItem>
                        <SelectItem value="buyer">عميل طالب الشراء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="propertyType">نوع العقار</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع العقار" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">عنوان الإعلان</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="أدخل عنوان مميز للعقار"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">وصف العقار</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="أدخل وصف تفصيلي للعقار (المواصفات، الموقع، المرافق، إلخ)"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (ريال يمني)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="أدخل السعر"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">المساحة (متر مربع)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      placeholder="أدخل المساحة"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="المدينة - الحي"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="floors">عدد الأدوار (اختياري)</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.floors}
                      onChange={(e) => setFormData({...formData, floors: e.target.value})}
                      placeholder="عدد الأدوار"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rooms">عدد الغرف (اختياري)</Label>
                    <Input
                      id="rooms"
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                      placeholder="عدد الغرف"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">الاسم</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="أدخل رقم الهاتف للتواصل"
                      required
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">ملاحظة مهمة</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        لن يتم نشر الإعلان مباشرة. سيتم مراجعته وتعديله من قبل المشرف لضمان حماية العمولة وجودة الخدمة.
                        العنوان الدقيق وبيانات التواصل ستكون متاحة للمشرف فقط.
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  إرسال للمراجعة
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RealEstateSection

