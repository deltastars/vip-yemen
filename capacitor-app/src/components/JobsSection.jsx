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
  Briefcase, 
  Users, 
  Building, 
  Clock,
  DollarSign,
  Upload,
  FileText,
  Plus,
  Search,
  Eye,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const JobsSection = () => {
  const [activeSubTab, setActiveSubTab] = useState('job-seekers')
  const [jobSeekerData, setJobSeekerData] = useState({
    name: '',
    specialization: '',
    phone: '',
    email: '',
    experience: '',
    cv: null,
    certificates: null
  })
  
  const [employerData, setEmployerData] = useState({
    companyName: '',
    jobTitle: '',
    jobType: '',
    positions: '',
    salary: '',
    workHours: '',
    requirements: '',
    description: '',
    phone: '',
    email: ''
  })

  // بيانات وهمية للعرض
  const sampleJobSeekers = [
    {
      id: 1,
      name: 'أحمد محمد علي',
      specialization: 'مهندس برمجيات',
      experience: '5 سنوات',
      phone: '777123456',
      status: 'قيد المراجعة',
      submittedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'فاطمة أحمد',
      specialization: 'محاسبة',
      experience: '3 سنوات',
      phone: '777654321',
      status: 'مقبول مبدئياً',
      submittedAt: '2024-01-14'
    },
    {
      id: 3,
      name: 'محمد سالم',
      specialization: 'مدرس رياضيات',
      experience: '7 سنوات',
      phone: '777111222',
      status: 'تم التواصل',
      submittedAt: '2024-01-13'
    }
  ]

  const sampleJobOffers = [
    {
      id: 1,
      companyName: 'شركة التقنية المتقدمة',
      jobTitle: 'مطور ويب',
      jobType: 'دوام كامل',
      positions: '2',
      salary: '300000',
      workHours: '8 ساعات - من 8 صباحاً إلى 4 عصراً',
      requirements: 'خبرة 3 سنوات في React و Node.js',
      status: 'منشور',
      applications: 15
    },
    {
      id: 2,
      companyName: 'مستشفى الأمل',
      jobTitle: 'ممرض/ممرضة',
      jobType: 'دوام جزئي',
      positions: '3',
      salary: '150000',
      workHours: '6 ساعات - مناوبات',
      requirements: 'دبلوم تمريض + ترخيص مزاولة المهنة',
      status: 'قيد المراجعة',
      applications: 8
    }
  ]

  const jobTypes = [
    { value: 'full-time', label: 'دوام كامل' },
    { value: 'part-time', label: 'دوام جزئي' },
    { value: 'contract', label: 'عقد مؤقت' },
    { value: 'freelance', label: 'عمل حر' },
    { value: 'internship', label: 'تدريب' }
  ]

  const specializations = [
    'مهندس برمجيات',
    'محاسب',
    'مدرس',
    'طبيب',
    'ممرض',
    'مهندس مدني',
    'مهندس كهربائي',
    'مصمم جرافيك',
    'مترجم',
    'محامي',
    'صيدلي',
    'مهندس معماري'
  ]

  const handleJobSeekerSubmit = (e) => {
    e.preventDefault()
    console.log('Job Seeker Form submitted:', jobSeekerData)
    alert('تم إرسال طلبك بنجاح! ستتم مراجعة بياناتك من قبل المشرف.')
    setJobSeekerData({
      name: '',
      specialization: '',
      phone: '',
      email: '',
      experience: '',
      cv: null,
      certificates: null
    })
  }

  const handleEmployerSubmit = (e) => {
    e.preventDefault()
    console.log('Employer Form submitted:', employerData)
    alert('تم إرسال طلب التوظيف بنجاح! سيتم مراجعته قبل النشر.')
    setEmployerData({
      companyName: '',
      jobTitle: '',
      jobType: '',
      positions: '',
      salary: '',
      workHours: '',
      requirements: '',
      description: '',
      phone: '',
      email: ''
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المراجعة': return 'bg-yellow-100 text-yellow-800'
      case 'مقبول مبدئياً': return 'bg-blue-100 text-blue-800'
      case 'تم التواصل': return 'bg-green-100 text-green-800'
      case 'مرفوض': return 'bg-red-100 text-red-800'
      case 'منشور': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'قيد المراجعة': return <AlertCircle className="h-4 w-4" />
      case 'مقبول مبدئياً': return <CheckCircle className="h-4 w-4" />
      case 'تم التواصل': return <CheckCircle className="h-4 w-4" />
      case 'مرفوض': return <XCircle className="h-4 w-4" />
      case 'منشور': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
            <span>قسم التوظيف</span>
          </CardTitle>
          <CardDescription>
            منصة آمنة للتوظيف مع حماية كاملة للبيانات والتحكم الكامل للمشرف
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="job-seekers">المتقدمون</TabsTrigger>
          <TabsTrigger value="job-offers">الوظائف المتاحة</TabsTrigger>
          <TabsTrigger value="apply-job">تقديم طلب</TabsTrigger>
          <TabsTrigger value="post-job">نشر وظيفة</TabsTrigger>
        </TabsList>

        <TabsContent value="job-seekers" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="البحث في المتقدمين..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="التخصص" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="accepted">مقبول مبدئياً</SelectItem>
                <SelectItem value="contacted">تم التواصل</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleJobSeekers.map((seeker) => (
              <Card key={seeker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>{seeker.name}</span>
                  </CardTitle>
                  <CardDescription>{seeker.specialization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الخبرة:</span>
                      <span className="text-sm font-medium">{seeker.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">تاريخ التقديم:</span>
                      <span className="text-sm font-medium">{seeker.submittedAt}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">الحالة:</span>
                      <Badge className={getStatusColor(seeker.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(seeker.status)}
                          <span>{seeker.status}</span>
                        </span>
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Button size="sm" variant="outline" className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>السيرة الذاتية</span>
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
        </TabsContent>

        <TabsContent value="job-offers" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="البحث في الوظائف..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="نوع الوظيفة" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleJobOffers.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>{job.jobTitle}</span>
                  </CardTitle>
                  <CardDescription>{job.companyName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">نوع الوظيفة:</span>
                      <span className="text-sm font-medium">{job.jobType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">عدد المناصب:</span>
                      <span className="text-sm font-medium">{job.positions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الراتب:</span>
                      <span className="text-sm font-medium text-green-600">
                        {parseInt(job.salary).toLocaleString()} ريال
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ساعات العمل:</span>
                      <span className="text-sm font-medium">{job.workHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">المتقدمين:</span>
                      <span className="text-sm font-medium">{job.applications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">الحالة:</span>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-gray-600 mb-2">المتطلبات:</p>
                      <p className="text-sm">{job.requirements}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Button size="sm" variant="outline" className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>عرض التفاصيل</span>
                      </Button>
                      <Button size="sm" className="flex items-center space-x-1">
                        <Plus className="h-4 w-4" />
                        <span>تقديم</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apply-job">
          <Card>
            <CardHeader>
              <CardTitle>تقديم طلب توظيف</CardTitle>
              <CardDescription>
                املأ النموذج أدناه للتقديم على الوظائف. جميع البيانات آمنة ومحمية ولن تكون متاحة إلا للمشرف فقط.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJobSeekerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={jobSeekerData.name}
                      onChange={(e) => setJobSeekerData({...jobSeekerData, name: e.target.value})}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialization">التخصص</Label>
                    <Select 
                      value={jobSeekerData.specialization} 
                      onValueChange={(value) => setJobSeekerData({...jobSeekerData, specialization: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التخصص" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={jobSeekerData.phone}
                      onChange={(e) => setJobSeekerData({...jobSeekerData, phone: e.target.value})}
                      placeholder="أدخل رقم الهاتف"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={jobSeekerData.email}
                      onChange={(e) => setJobSeekerData({...jobSeekerData, email: e.target.value})}
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">سنوات الخبرة</Label>
                  <Select 
                    value={jobSeekerData.experience} 
                    onValueChange={(value) => setJobSeekerData({...jobSeekerData, experience: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر سنوات الخبرة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresh">خريج جديد</SelectItem>
                      <SelectItem value="1-2">1-2 سنة</SelectItem>
                      <SelectItem value="3-5">3-5 سنوات</SelectItem>
                      <SelectItem value="6-10">6-10 سنوات</SelectItem>
                      <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cv">رفع السيرة الذاتية (PDF)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">اضغط لرفع السيرة الذاتية</p>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => setJobSeekerData({...jobSeekerData, cv: e.target.files[0]})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="certificates">رفع الشهادات (PDF/صور)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">اضغط لرفع الشهادات</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                        onChange={(e) => setJobSeekerData({...jobSeekerData, certificates: e.target.files})}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">حماية البيانات</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        جميع بياناتك محمية ومشفرة. لن يتمكن أي شخص من رؤية معلوماتك إلا المشرف فقط.
                        سيتم التواصل معك مباشرة عند توفر فرصة مناسبة.
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  إرسال الطلب
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="post-job">
          <Card>
            <CardHeader>
              <CardTitle>نشر وظيفة جديدة</CardTitle>
              <CardDescription>
                املأ النموذج أدناه لنشر وظيفة. سيتم مراجعة الطلب قبل النشر لضمان جودة الخدمة وحماية العمولة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmployerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">اسم المؤسسة/الشركة</Label>
                    <Input
                      id="companyName"
                      value={employerData.companyName}
                      onChange={(e) => setEmployerData({...employerData, companyName: e.target.value})}
                      placeholder="أدخل اسم المؤسسة"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
                    <Input
                      id="jobTitle"
                      value={employerData.jobTitle}
                      onChange={(e) => setEmployerData({...employerData, jobTitle: e.target.value})}
                      placeholder="أدخل المسمى الوظيفي"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="jobType">نوع الوظيفة</Label>
                    <Select 
                      value={employerData.jobType} 
                      onValueChange={(value) => setEmployerData({...employerData, jobType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="positions">عدد الشواغر</Label>
                    <Input
                      id="positions"
                      type="number"
                      value={employerData.positions}
                      onChange={(e) => setEmployerData({...employerData, positions: e.target.value})}
                      placeholder="عدد المناصب"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="salary">الراتب (ريال يمني)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={employerData.salary}
                      onChange={(e) => setEmployerData({...employerData, salary: e.target.value})}
                      placeholder="أدخل الراتب"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="workHours">أوقات الدوام</Label>
                  <Input
                    id="workHours"
                    value={employerData.workHours}
                    onChange={(e) => setEmployerData({...employerData, workHours: e.target.value})}
                    placeholder="مثال: 8 ساعات - من 8 صباحاً إلى 4 عصراً"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">شروط العمل والمتطلبات</Label>
                  <Textarea
                    id="requirements"
                    value={employerData.requirements}
                    onChange={(e) => setEmployerData({...employerData, requirements: e.target.value})}
                    placeholder="أدخل المتطلبات والشروط المطلوبة للوظيفة"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">وصف الوظيفة</Label>
                  <Textarea
                    id="description"
                    value={employerData.description}
                    onChange={(e) => setEmployerData({...employerData, description: e.target.value})}
                    placeholder="أدخل وصف تفصيلي للوظيفة والمهام المطلوبة"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={employerData.phone}
                      onChange={(e) => setEmployerData({...employerData, phone: e.target.value})}
                      placeholder="أدخل رقم الهاتف للتواصل"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={employerData.email}
                      onChange={(e) => setEmployerData({...employerData, email: e.target.value})}
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">ملاحظة مهمة</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        سيتم مراجعة طلب نشر الوظيفة من قبل المشرف قبل النشر. لن يتمكن المتقدمون من التواصل معك مباشرة،
                        بل سيتم التنسيق من خلال المشرف لضمان حقك في العمولة وجودة الخدمة.
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

export default JobsSection

