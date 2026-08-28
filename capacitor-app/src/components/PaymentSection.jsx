import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  CreditCard, 
  Building, 
  User,
  Phone,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  FileText
} from 'lucide-react'

const PaymentSection = () => {
  const [paymentData, setPaymentData] = useState({
    senderName: '',
    transferNumber: '',
    phone: '',
    amount: '',
    notes: '',
    receipt: null
  })

  const [copiedField, setCopiedField] = useState('')

  // بيانات بنك الكريمي
  const bankInfo = {
    bankName: 'بنك الكريمي',
    beneficiaryName: 'علي درهم محمد الدحان',
    accountNumber: '121147699',
    verificationNumber: '00967773597404'
  }

  // بيانات وهمية للمدفوعات
  const samplePayments = [
    {
      id: 1,
      senderName: 'أحمد محمد',
      amount: '50000',
      transferNumber: 'TR123456789',
      phone: '777123456',
      status: 'مقبول',
      submittedAt: '2024-01-15 10:30',
      processedAt: '2024-01-15 11:00'
    },
    {
      id: 2,
      senderName: 'فاطمة علي',
      amount: '25000',
      transferNumber: 'TR987654321',
      phone: '777654321',
      status: 'قيد المراجعة',
      submittedAt: '2024-01-15 14:20',
      processedAt: null
    },
    {
      id: 3,
      senderName: 'محمد سالم',
      amount: '75000',
      transferNumber: 'TR456789123',
      phone: '777111222',
      status: 'مرفوض',
      submittedAt: '2024-01-14 16:45',
      processedAt: '2024-01-14 17:30',
      rejectionReason: 'الإيصال غير واضح'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Payment Form submitted:', paymentData)
    alert('تم إرسال إثبات الدفع بنجاح! سيتم مراجعته من قبل المشرف.')
    setPaymentData({
      senderName: '',
      transferNumber: '',
      phone: '',
      amount: '',
      notes: '',
      receipt: null
    })
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(''), 2000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'مقبول': return 'bg-green-100 text-green-800'
      case 'قيد المراجعة': return 'bg-yellow-100 text-yellow-800'
      case 'مرفوض': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'مقبول': return <CheckCircle className="h-4 w-4" />
      case 'قيد المراجعة': return <Clock className="h-4 w-4" />
      case 'مرفوض': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <span>قسم الدفع</span>
          </CardTitle>
          <CardDescription>
            نظام دفع آمن مع مراجعة فورية للمعاملات
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* معلومات البنك */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Building className="h-5 w-5" />
              <span>معلومات التحويل - بنك الكريمي</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">اسم البنك:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-green-700">{bankInfo.bankName}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">اسم المستفيد:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{bankInfo.beneficiaryName}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(bankInfo.beneficiaryName, 'beneficiary')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {copiedField === 'beneficiary' && (
                      <span className="text-xs text-green-600">تم النسخ!</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">رقم الحساب:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-blue-600 text-lg">{bankInfo.accountNumber}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(bankInfo.accountNumber, 'account')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {copiedField === 'account' && (
                      <span className="text-xs text-green-600">تم النسخ!</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">رقم التحقق:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-purple-600 text-lg">{bankInfo.verificationNumber}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(bankInfo.verificationNumber, 'verification')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {copiedField === 'verification' && (
                      <span className="text-xs text-green-600">تم النسخ!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">ملاحظات مهمة قبل التحويل:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• تأكد من صحة رقم الحساب ورقم التحقق</li>
                <li>• احتفظ بإيصال التحويل لرفعه لاحقاً</li>
                <li>• سيتم مراجعة الدفع خلال 24 ساعة</li>
                <li>• في حالة وجود مشكلة، سيتم التواصل معك</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* نموذج رفع إثبات الدفع */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>رفع إثبات الدفع</span>
            </CardTitle>
            <CardDescription>
              املأ النموذج أدناه بعد إتمام التحويل
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="senderName">اسم المرسل</Label>
                <Input
                  id="senderName"
                  value={paymentData.senderName}
                  onChange={(e) => setPaymentData({...paymentData, senderName: e.target.value})}
                  placeholder="أدخل اسم المرسل كما يظهر في الإيصال"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transferNumber">رقم التحويل</Label>
                  <Input
                    id="transferNumber"
                    value={paymentData.transferNumber}
                    onChange={(e) => setPaymentData({...paymentData, transferNumber: e.target.value})}
                    placeholder="رقم التحويل (إن وجد)"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">المبلغ (ريال يمني)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    placeholder="أدخل المبلغ المحول"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={paymentData.phone}
                  onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
                  placeholder="أدخل رقم هاتفك للتواصل"
                  required
                />
              </div>

              <div>
                <Label htmlFor="receipt">رفع صورة الإيصال (إجباري)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">اضغط لرفع صورة الإيصال</p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF - حد أقصى 5MB</p>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={(e) => setPaymentData({...paymentData, receipt: e.target.files[0]})}
                    required
                  />
                  {paymentData.receipt && (
                    <p className="text-sm text-green-600 mt-2">
                      تم اختيار الملف: {paymentData.receipt.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                <Textarea
                  id="notes"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                  placeholder="أي ملاحظات أو معلومات إضافية"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                إرسال إثبات الدفع
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* سجل المدفوعات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <span>سجل المدفوعات</span>
          </CardTitle>
          <CardDescription>
            تتبع حالة مدفوعاتك المرسلة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {samplePayments.map((payment) => (
              <Card key={payment.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <span>{payment.senderName}</span>
                      </h4>
                      <p className="text-sm text-gray-600">
                        المبلغ: <span className="font-medium text-green-600">
                          {parseInt(payment.amount).toLocaleString()} ريال
                        </span>
                      </p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(payment.status)}
                        <span>{payment.status}</span>
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">رقم التحويل:</span>
                      <span className="font-medium ml-2">{payment.transferNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">رقم الهاتف:</span>
                      <span className="font-medium ml-2">{payment.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">تاريخ الإرسال:</span>
                      <span className="font-medium ml-2">{payment.submittedAt}</span>
                    </div>
                    {payment.processedAt && (
                      <div>
                        <span className="text-gray-600">تاريخ المراجعة:</span>
                        <span className="font-medium ml-2">{payment.processedAt}</span>
                      </div>
                    )}
                  </div>

                  {payment.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        <strong>سبب الرفض:</strong> {payment.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentSection

