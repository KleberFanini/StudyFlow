// src/screens/WelcomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../styles/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Topo / Logo */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={48} color="#FFF" />
          </View>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={14} color={COLORS.primary} />
            <Text style={styles.badgeText}>Produtividade Acadêmica</Text>
          </View>
          <Text style={styles.title}>StudyFlow</Text>
          <Text style={styles.subtitle}>
            Organize suas disciplinas, notas, fotos do quadro e referências bibliográficas em um só lugar.
          </Text>
        </View>

        {/* Recursos Principais */}
        <View style={styles.featuresCard}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="calculator-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Cálculo Automático de Médias & CRA</Text>
              <Text style={styles.featureSub}>Acompanhe seu rendimento acadêmico em tempo real</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.secondaryLight }]}>
              <Ionicons name="camera-outline" size={20} color={COLORS.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Anotações com Câmera Integrada</Text>
              <Text style={styles.featureSub}>Fotografe a lousa e anotações direto na matéria</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="book-outline" size={20} color="#7E22CE" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Google Books API em Tempo Real</Text>
              <Text style={styles.featureSub}>Pesquise referências e bibliografias recomendadas</Text>
            </View>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Acessar Meu Painel</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Criar Conta de Estudante</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  featuresCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  featureSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  actions: {
    gap: 10,
    marginBottom: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
