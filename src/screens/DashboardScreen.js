// src/screens/DashboardScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubjectContext } from '../context/SubjectContext';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS } from '../styles/theme';

export default function DashboardScreen({ navigation }) {
  const { subjects, overallCRA, approvedCount, totalSubjects } = useContext(SubjectContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Olá, {currentUser?.name?.split(' ')[0] || 'Estudante'} 🎓
            </Text>
            <Text style={styles.institutionText}>
              {currentUser?.institution || 'FAFIRE'} • {currentUser?.course || 'Pós-Graduação'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Ionicons name="person-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Métricas Principais (CRA / Médias) */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { borderLeftColor: COLORS.primary }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>CRA Geral</Text>
              <Ionicons name="ribbon-outline" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.metricValue}>{overallCRA}</Text>
            <Text style={styles.metricSub}>Rendimento acadêmico</Text>
          </View>

          <View style={[styles.metricCard, { borderLeftColor: COLORS.secondary }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Disciplinas</Text>
              <Ionicons name="book-outline" size={16} color={COLORS.secondary} />
            </View>
            <Text style={styles.metricValue}>{totalSubjects}</Text>
            <Text style={styles.metricSub}>{approvedCount} aprovada(s)</Text>
          </View>
        </View>

        {/* Card de Prazo Urgente / Notificação */}
        <View style={styles.alertCard}>
          <View style={styles.alertIconCircle}>
            <Ionicons name="time" size={20} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Próxima Entrega Importante</Text>
            <Text style={styles.alertDesc}>
              Projeto Prático de Desenvolvimento Mobile • Prazo Final: 24/10/2026
            </Text>
          </View>
        </View>

        {/* Banner de Acesso Rápido à Google Books API */}
        <TouchableOpacity
          style={styles.booksBanner}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Biblioteca')}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.booksBadge}>
              <Ionicons name="cloud" size={12} color="#7E22CE" />
              <Text style={styles.booksBadgeText}>API Externa Google Books</Text>
            </View>
            <Text style={styles.booksTitle}>Biblioteca Acadêmica Virtual</Text>
            <Text style={styles.booksSub}>
              Pesquise livros, autores e referências bibliográficas recomendadas para as suas matérias.
            </Text>
          </View>
          <View style={styles.booksArrow}>
            <Ionicons name="arrow-forward" size={18} color="#7E22CE" />
          </View>
        </TouchableOpacity>

        {/* Seção Disciplinas do Semestre */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Disciplinas em Andamento</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Disciplinas')}>
            <Text style={styles.sectionLink}>Ver Todas</Text>
          </TouchableOpacity>
        </View>

        {subjects.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.subjectCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SubjectDetails', { subject: item })}
          >
            <View style={[styles.colorStripe, { backgroundColor: item.color || COLORS.primary }]} />
            <View style={styles.subjectContent}>
              <View style={styles.subjectTopRow}>
                <Text style={styles.subjectCode}>{item.code}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === 'Aprovado' ? COLORS.successLight : COLORS.primaryLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.status === 'Aprovado' ? COLORS.success : COLORS.primaryDark,
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.subjectProfessor}>
                <Ionicons name="person-outline" size={13} color={COLORS.textMuted} /> {item.professor}
              </Text>

              <View style={styles.subjectBottomRow}>
                <View style={styles.scheduleTag}>
                  <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
                  <Text style={styles.scheduleText}>{item.schedule}</Text>
                </View>

                <View style={styles.averageBox}>
                  <Text style={styles.averageLabel}>Média:</Text>
                  <Text style={styles.averageValue}>{item.average.toFixed(1)}</Text>
                </View>
              </View>

              {item.photos && item.photos.length > 0 && (
                <View style={styles.photosIndicator}>
                  <Ionicons name="camera" size={13} color={COLORS.primary} />
                  <Text style={styles.photosIndicatorText}>
                    {item.photos.length} foto(s) de anotações anexadas
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  institutionText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  avatarButton: {
    padding: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  alertIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  alertDesc: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 1,
  },
  booksBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: SPACING.lg,
  },
  booksBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  booksBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E22CE',
  },
  booksTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#581C87',
  },
  booksSub: {
    fontSize: 12,
    color: '#7E22CE',
    marginTop: 2,
    lineHeight: 16,
  },
  booksArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subjectCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  colorStripe: {
    width: 6,
  },
  subjectContent: {
    flex: 1,
    padding: SPACING.md,
  },
  subjectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectCode: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },
  subjectProfessor: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  subjectBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  scheduleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  averageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  averageLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  averageValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  photosIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginTop: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  photosIndicatorText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
