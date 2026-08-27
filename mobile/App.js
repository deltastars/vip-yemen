import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const services = [
  { title: 'التسويق الإلكتروني', subtitle: 'حلول إعلانية وهوية رقمية', icon: 'megaphone-outline' },
  { title: 'التسويق العقاري', subtitle: 'عرض العقارات والوصول للمشترين', icon: 'business-outline' },
  { title: 'التوظيف والفرص', subtitle: 'ربط المهارات بالفرص المناسبة', icon: 'briefcase-outline' },
  { title: 'الخدمات العامة', subtitle: 'مساندة عملية عبر تواصل مباشر', icon: 'sparkles-outline' },
];

const links = [
  ['واتساب مباشر', 'https://wa.me/qr/CF2G3HMH3SUFJ1'],
  ['فيسبوك', 'https://www.facebook.com/ViPservicesYemen/'],
  ['تويتر / X', 'https://twitter.com/ViPservicesYeme'],
  ['كل القنوات', 'https://linktr.ee/vipservicesyemen'],
];

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.mark}><Text style={styles.markText}>VIP</Text></View>
          <View>
            <Text style={styles.brand}>ViP <Text style={styles.gold}>Yemen</Text></Text>
            <Text style={styles.kicker}>للتوظيف والتسويق والخدمات العامة</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>منصة يمنية للفرص والخدمات</Text>
          <Text style={styles.title}>خطوتك التالية{ '\n' }<Text style={styles.gold}>تبدأ من هنا.</Text></Text>
          <Text style={styles.lead}>مساحة عملية تجمع التسويق، العقار، والتوظيف بتواصل محلي مباشر.</Text>
          <TouchableOpacity style={styles.primary} onPress={() => Linking.openURL('https://wa.me/qr/CF2G3HMH3SUFJ1')}>
            <Text style={styles.primaryText}>تواصل معنا الآن</Text><Ionicons name="arrow-back" size={18} color="#0B2034" />
          </TouchableOpacity>
        </View>

        <View style={styles.route}><View style={styles.dot} /><View style={styles.line} /><View style={styles.dot} /><View style={styles.line} /><View style={styles.dot} /></View>

        <Text style={styles.sectionLabel}>01 — خدماتنا</Text>
        <View style={styles.grid}>
          {services.map((service) => (
            <View key={service.title} style={styles.card}>
              <Ionicons name={service.icon} size={25} color="#F3B71B" />
              <Text style={styles.cardTitle}>{service.title}</Text>
              <Text style={styles.cardSubtitle}>{service.subtitle}</Text>
            </View>
          ))}
        </View>

        <View style={styles.about}>
          <Text style={styles.sectionLabel}>02 — تواصل</Text>
          {links.map(([label, url]) => (
            <TouchableOpacity key={label} style={styles.link} onPress={() => Linking.openURL(url)}>
              <Text style={styles.linkText}>{label}</Text><Ionicons name="arrow-up-left" size={17} color="#F3B71B" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>ViP <Text style={styles.gold}>Yemen</Text></Text>
          <Text style={styles.footerText}>© 2026 ViP Yemen · جميع الحقوق محفوظة</Text>
          <Text style={styles.developer}>المهندس ومطور البرمجيات: علي درهم الدحان</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B2034' },
  content: { padding: 22, paddingBottom: 48 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#25435B' },
  mark: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#F3B71B', alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#F3B71B', fontWeight: '800', fontSize: 15 },
  brand: { color: '#FFFFFF', fontWeight: '800', fontSize: 22, textAlign: 'right' },
  gold: { color: '#F3B71B' },
  kicker: { color: '#AFC0CC', fontSize: 10, marginTop: 2, textAlign: 'right' },
  hero: { paddingTop: 64, paddingBottom: 42, alignItems: 'flex-end' },
  eyebrow: { color: '#F3B71B', fontSize: 12, marginBottom: 16, textAlign: 'right' },
  title: { color: '#FFFFFF', fontSize: 42, lineHeight: 52, fontWeight: '800', textAlign: 'right' },
  lead: { color: '#B9C9D3', lineHeight: 26, fontSize: 15, marginTop: 20, textAlign: 'right' },
  primary: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F3B71B', paddingHorizontal: 18, paddingVertical: 14, marginTop: 25 },
  primaryText: { color: '#0B2034', fontWeight: '800', fontSize: 14 },
  route: { flexDirection: 'row', alignItems: 'center', marginBottom: 42 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#F3B71B' },
  line: { flex: 1, height: 1, borderTopWidth: 1, borderColor: '#486277', borderStyle: 'dashed' },
  sectionLabel: { color: '#F3B71B', fontSize: 12, marginBottom: 16, textAlign: 'right' },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', minHeight: 145, padding: 17, backgroundColor: '#122D44', borderWidth: 1, borderColor: '#27455C', alignItems: 'flex-end' },
  cardTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, marginTop: 15, textAlign: 'right' },
  cardSubtitle: { color: '#9FB5C3', fontSize: 11, lineHeight: 18, marginTop: 8, textAlign: 'right' },
  about: { marginTop: 44, paddingTop: 28, borderTopWidth: 1, borderTopColor: '#25435B' },
  link: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#25435B' },
  linkText: { color: '#FFFFFF', fontSize: 14 },
  footer: { marginTop: 42, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#25435B', alignItems: 'flex-end' },
  footerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  footerText: { color: '#8FA6B5', fontSize: 10, marginTop: 12 },
  developer: { color: '#F3B71B', fontSize: 11, marginTop: 10, textAlign: 'right' },
});
