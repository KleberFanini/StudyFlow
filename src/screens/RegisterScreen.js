// src/screens/RegisterScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS } from '../styles/theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('Faculdade FAFIRE');
  const [course, setCourse] = useState('Pós-Graduação em Desenvolvimento Mobile');
  const [semester, setSemester] = useState('2º Semestre / 2026');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos Obrigatórios', 'Preencha nome completo, e-mail acadêmico e senha.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha Inválida', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        institution: institution.trim(),
        course: course.trim(),
        semester: semester.trim(),
      });

      Alert.alert('Matrícula Criada!', 'Seja bem-vindo(a) ao StudyFlow.');
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message || 'Falha no cadastro.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Cadastro de Estudante</Text>
            <Text style={styles.subtitle}>
              Crie seu perfil acadêmico para começar a organizar seu semestre.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mariana Silva Souza"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>E-mail Acadêmico *</Text>
            <TextInput
              style={styles.input}
              placeholder="mariana@fafire.br ou mariana@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Senha * (mínimo 6 caracteres)</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha de acesso"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Instituição de Ensino</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Faculdade FAFIRE"
              value={institution}
              onChangeText={setInstitution}
            />

            <Text style={styles.label}>Curso / Especialização</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Pós em Desenvolvimento Mobile"
              value={course}
              onChangeText={setCourse}
            />

            <Text style={styles.label}>Semestre / Período Letivo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2º Semestre / 2026"
              value={semester}
              onChangeText={setSemester}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegister}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Concluir Matrícula no App</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 46,
    fontSize: 14,
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
