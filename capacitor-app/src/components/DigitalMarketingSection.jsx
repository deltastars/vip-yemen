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
  Car, 
  Smartphone, 
  Sofa, 
  Wrench, 
  Hammer, 
  Plus,
  Search,
  Filter,
  Eye,
  Phone
} from 'lucide-react'

const DigitalMarketingSection = () => {
  const [activeSubTab, setActiveSubTab] = useState('products')
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    title: '',
    description: '',
    price: '',
    phone: '',
    location: ''
  })

  // بيانات وهمية للعرض
  const sampleProducts = [
    {
      id: 1,
      type: 'عرض',
      category: 'سيارات',
      title: 'تويوتا كامري 2020',
      description: 'سيارة في حالة ممتازة، قطعت 50 ألف كم',
      price: '45000',
      phone: '777123456',
      location: 'صنعاء',
      status: 'منشور'
    },
    {
      id: 2,
      type: 'طلب',
      category: 'هواتف',
      title: 'مطلوب آيفون 13',
      description: 'أبحث عن آيفون 13 مستعمل بحالة جيدة',
      price: '300000',
      phone: '777654321',
      location: 'عدن',
      status: 'قيد المراجعة'
    }
  ]

  const sampleServices = [
    {
      id: 1,
      type: 'عرض',
      category: 'كهربائي',
      title: 'خدمات كهربائية منزلية',
      description: 'تركيب وصيانة الأجهزة الكهربائية',
      price: '5000',
      phone: '777111222',
      location: 'تعز',
      status: 'منشور'
    },
    {
      id: 2,
      type: 'طلب',
      category: 'سباك',
      title: 'مطلوب سباك للمنزل',
      description: 'إصلاح تسريب في الحمام',
      price: '3000',
      phone: '777333444',
      location: 'الحديدة',
      status: 'منشور'
    }
  ]

  const productCategories = [
    { value: 'cars', label: 'سيارات', icon: Car },
    { value: 'electronics', label: 'أجهزة إلكترونية', icon: Smartphone },
    { value: 'phones', label: 'هواتف', icon: Smartphone },
    { value: 'furniture', label: 'أثاث', icon: Sofa },
    { value: 'bedroom', label: 'غرف نوم / دولايب / أبواب خشب', icon: Sofa }
  ]

  const serviceCategories = [
    { value: 'logistics', label: 'دعم لوجستي', icon: Wrench },
    { value: 'electrician', label: 'كهربائي', icon: Wrench },
    { value: 'plumber', label: 'سباك', icon: Wrench },
    { value: 'carpenter', label: 'نجار', icon: Hammer },
    { value: 'construction', label: 'بناء', icon: Hammer },
    { value: 'engineer', label: 'مهندس', icon: Wrench },
    { value: 'teacher', label: 'معلم', icon: Wrench },
    { value: 'welding', label: 'ورش لحام', icon: Hammer },
    { value: 'aluminum', label: 'أعمال ألمنيوم وزجاج', icon: Hammer }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // هنا سيتم إرسال البيانات إلى الخادم
    alert('تم إرسال طلبك بنجاح! سيتم مراجعته قبل النشر.')
    setFormData({
      type: '',
      category: '',
      title: '',
      description: '',
      price: '',
      phone: '',
      location: ''
    })
  }

  const renderItemCard = (item) => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription className="mt-1">{item.description}</CardDescription>
          </div>
          <Badge variant={item.type === 'عرض' ? 'default' : 'secondary'}>
            {item.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">الفئة:</span>
            <span className="text-sm font-medium">{item.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">السعر:</span>
            <span className="text-sm font-medium">{item.price} ريال</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">الموقع:</span>
            <span className="text-sm font-medium">{item.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">الحالة:</span>
            <Badge variant={item.status === 'منشور' ? 'default' : 'outline'}>
              {item.status}
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
            <div className="bg-blue-100 p-2 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <span>التسويق الإلكتروني</span>
          </CardTitle>
          <CardDescription>
            منصة شاملة لعرض وطلب المنتجات والخدمات
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">المنتجات</TabsTrigger>
          <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="add-new">إضافة جديد</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="البحث في المنتجات..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="تصفية حسب الفئة" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
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
            {sampleProducts.map(renderItemCard)}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="البحث في الخدمات..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="تصفية حسب الفئة" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
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
            {sampleServices.map(renderItemCard)}
          </div>
        </TabsContent>

        <TabsContent value="add-new">
          <Card>
            <CardHeader>
              <CardTitle>إضافة منتج أو خدمة جديدة</CardTitle>
              <CardDescription>
                املأ النموذج أدناه لإضافة منتج أو خدمة. سيتم مراجعة طلبك قبل النشر.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">النوع</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offer">عرض</SelectItem>
                        <SelectItem value="request">طلب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">الفئة</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <optgroup label="المنتجات">
                          {productCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </optgroup>
                        <optgroup label="الخدمات">
                          {serviceCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </optgroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">العنوان</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="أدخل عنوان المنتج أو الخدمة"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="أدخل وصف تفصيلي للمنتج أو الخدمة"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="أدخل المدينة أو المنطقة"
                      required
                    />
                  </div>
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

export default DigitalMarketingSection

