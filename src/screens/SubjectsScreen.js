// src/screens/SubjectsScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubjectContext } from '../context/SubjectContext';
import { COLORS, SPACING, RADIUS } from '../styles/theme';

const PALETTE_COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

export default function SubjectsScreen({ navigation }) {
  const { subjects, addSubject, updateSubject, deleteSubject, resetToDefaultSubjects } =
    useContext(SubjectContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  // Campos do formulário
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [workload, setWorkload] = useState('60');
  const [color, setColor] = useState('#4F46E5');
  const [notes, setNotes] = useState('');

  // Abrir Modal de Criação (CREATE)
  const handleOpenCreate = () => {
    setEditingSubjectId(null);
    setName('');
    setCode('');
    setProfessor('');
    setRoom('');
    setSchedule('');
    setWorkload('60');
    setColor('#4F46E5');
    setNotes('');
    setModalVisible(true);
  };

  // Abrir Modal de Edição (UPDATE)
  const handleOpenEdit = (subject) => {
    setEditingSubjectId(subject.id);
    setName(subject.name);
    setCode(subject.code || '');
    setProfessor(subject.professor || '');
    setRoom(subject.room || '');
    setSchedule(subject.schedule || '');
    setWorkload(subject.workload ? subject.workload.toString() : '60');
    setColor(subject.color || '#4F46E5');
    setNotes(subject.notes || '');
    setModalVisible(true);
  };

  // Salvar (CREATE ou UPDATE)
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validação', 'Informe o nome da disciplina.');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim() || `DISC-${Math.floor(100 + Math.random() * 900)}`,
      professor: professor.trim() || 'Docente Convidado',
      room: room.trim() || 'Sala Virtual / Presencial',
      schedule: schedule.trim() || 'Horário a definir',
      workload: parseInt(workload, 10) || 60,
      color,
      notes: notes.trim(),
    };

    if (editingSubjectId) {
      // UPDATE
      await updateSubject(editingSubjectId, payload);
      Alert.alert('Atualizado!', 'Dados da disciplina atualizados com sucesso.');
    } else {
      // CREATE
      await addSubject(payload);
      Alert.alert('Cadastrada!', 'Nova matéria adicionada à sua grade curricular.');
    }

    setModalVisible(false);
  };

  // Excluir com confirmação (DELETE)
  const handleDelete = (subject) => {
    Alert.alert(
      'Remover Disciplina',
      `Tem certeza de que deseja remover "${subject.name}"? As avaliações e anotações vinculadas serão excluídas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteSubject(subject.id);
            Alert.alert('Removida', 'Disciplina excluída com sucesso.');
          },
        },
      ]
    );
  };

  const renderSubjectItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.cardStripe, { backgroundColor: item.color || COLORS.primary }]} />
      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <Text style={styles.subjectCode}>{item.code}</Text>
          <View
            style={[
              styles.statusTag,
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
                  color: item.status === 'Aprovado' ? COLORS.success : COLORS.primaryDark,
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('SubjectDetails', { subject: item })}
        >
          <Text style={styles.subjectName}>{item.name}</Text>
        </TouchableOpacity>

        <Text style={styles.professorText}>
          <Ionicons name="person-outline" size={13} color={COLORS.textMuted} /> {item.professor}
        </Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBadge}>
            <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.infoText}>{item.workload}h</Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.infoText}>{item.room}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons name="camera-outline" size={12} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.primaryDark, fontWeight: '700' }]}>
              {item.photos?.length || 0} fotos
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.averageContainer}>
            <Text style={styles.averageLabel}>Média Atual:</Text>
            <Text style={styles.averageVal}>{item.average.toFixed(1)}</Text>
          </View>

          <View style={styles.actionsGroup}>
            <TouchableOpacity
              style={styles.actionBtnEdit}
              onPress={() => handleOpenEdit(item)}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnDelete}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnDetails}
              onPress={() => navigation.navigate('SubjectDetails', { subject: item })}
            >
              <Text style={styles.actionBtnDetailsText}>Anotações</Text>
              <Ionicons name="chevron-forward" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Minhas Disciplinas</Text>
          <Text style={styles.subtitle}>
            CRUD completo com persistência local ({subjects.length} matriculadas)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newButton}
          onPress={handleOpenCreate}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.newButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                'Restaurar Demonstração',
                'Deseja restaurar as matérias padrão da grade acadêmica para avaliação?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Restaurar', onPress: resetToDefaultSubjects },
                ]
              );
            }}
          >
            <Ionicons name="refresh-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.resetButtonText}>Restaurar Disciplinas Padrão</Text>
          </TouchableOpacity>
        }
      />

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancel}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingSubjectId ? 'Editar Disciplina' : 'Nova Disciplina'}
              </Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.modalSave}>Salvar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalLabel}>Nome da Disciplina *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Engenharia de Requisitos"
                value={name}
                onChangeText={setName}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalLabel}>Código / Sigla</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ex: ER-2026"
                    value={code}
                    onChangeText={setCode}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalLabel}>Carga Horária (h)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="60"
                    keyboardType="numeric"
                    value={workload}
                    onChangeText={setWorkload}
                  />
                </View>
              </View>

              <Text style={styles.modalLabel}>Professor(a) Titular</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nome do docente"
                value={professor}
                onChangeText={setProfessor}
              />

              <Text style={styles.modalLabel}>Sala / Local das Aulas</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Laboratório 04 / Remoto"
                value={room}
                onChangeText={setRoom}
              />

              <Text style={styles.modalLabel}>Horário e Dia da Semana</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Sextas, 19h às 22h"
                value={schedule}
                onChangeText={setSchedule}
              />

              <Text style={styles.modalLabel}>Cor de Destaque no Painel</Text>
              <View style={styles.colorPickerRow}>
                {PALETTE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c },
                      color === c && styles.colorCircleSelected,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>

              <Text style={styles.modalLabel}>Ementa / Observações</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Conteúdo programático, livros-base e critérios de avaliação..."
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveButtonText}>
                  {editingSubjectId ? 'Salvar Alterações' : 'Cadastrar na Grade Curricular'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  newButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: SPACING.md,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardStripe: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectCode: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  professorText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  averageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  averageLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  averageVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnEdit: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDelete: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    gap: 3,
  },
  actionBtnDetailsText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  resetButtonText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCancel: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalSave: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalScroll: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 46,
    fontSize: 14,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  colorPickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 6,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  modalSaveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: 20,
  },
  modalSaveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
