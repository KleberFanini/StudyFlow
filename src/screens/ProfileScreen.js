// src/screens/ProfileScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { SubjectContext } from '../context/SubjectContext';
import { COLORS, SPACING, RADIUS } from '../styles/theme';

export default function ProfileScreen({ navigation }) {
  const { currentUser, logout } = useContext(AuthContext);
  const { overallCRA, approvedCount, totalSubjects } = useContext(SubjectContext);

  const handleLogout = () => {
    Alert.alert('Encerrar Sessão', 'Deseja sair da sua conta no StudyFlow?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho do Perfil */}
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{currentUser?.name || 'Estudante'}</Text>
          <Text style={styles.email}>{currentUser?.email || 'aluno@fafire.br'}</Text>

          <View style={styles.registrationBadge}>
            <Ionicons name="card-outline" size={13} color={COLORS.primaryDark} />
            <Text style={styles.registrationText}>
              Matrícula: {currentUser?.registration || '202610-994'}
            </Text>
          </View>
        </View>

        {/* Informações Institucionais */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados do Aluno</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Instituição:</Text>
            <Text style={styles.infoValue}>{currentUser?.institution || 'Faculdade FAFIRE'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Curso:</Text>
            <Text style={styles.infoValue}>{currentUser?.course || 'Pós em Desenvolvimento Mobile'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Semestre Letivo:</Text>
            <Text style={styles.infoValue}>{currentUser?.semester || '2026.2'}</Text>
          </View>
        </View>

        {/* Resumo de Desempenho Acadêmico */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Histórico & Rendimento</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{overallCRA}</Text>
              <Text style={styles.statLabel}>CRA Geral</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statVal}>{totalSubjects}</Text>
              <Text style={styles.statLabel}>Matriculadas</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: COLORS.success }]}>{approvedCount}</Text>
              <Text style={styles.statLabel}>Aprovadas</Text>
            </View>
          </View>
        </View>

        {/* Créditos Acadêmicos e Validação da Pós */}
        <View style={styles.academicCard}>
          <View style={styles.academicHeader}>
            <Ionicons name="school" size={20} color={COLORS.primaryDark} />
            <Text style={styles.academicTitle}>Projeto da Pós-Graduação • FAFIRE</Text>
          </View>
          <Text style={styles.academicText}>
            • **Disciplina:** Desenvolvimento de Aplicativos Móveis{'\n'}
            • **Docente:** Prof. Diogo Rodrigues{'\n'}
            • **Tema:** Ferramenta de Produtividade para Estudantes{'\n'}
            • **Arquitetura:** React Native / Expo SDK 57 (Compatível com Expo Go 57.0.9){'\n'}
            • **Requisitos:** CRUD completo, Câmera e Galeria (`expo-image-picker`), API Externa Google Books, persistência local offline (`AsyncStorage`) e 7 telas.
          </Text>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>Encerrar Sessão</Text>
        </TouchableOpacity>
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
    gap: 12,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  email: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  registrationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: 8,
    gap: 4,
  },
  registrationText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  academicCard: {
    backgroundColor: '#EEF2FF',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  academicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  academicTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  academicText: {
    fontSize: 12,
    color: '#3730A3',
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },
});
