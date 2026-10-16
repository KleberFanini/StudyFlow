// src/screens/SubjectDetailsScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SubjectContext } from '../context/SubjectContext';
import { COLORS, SPACING, RADIUS } from '../styles/theme';

export default function SubjectDetailsScreen({ route, navigation }) {
  const { subject: initialSubject } = route.params || {};
  const { subjects, updateSubject, addPhotoToSubject, removePhotoFromSubject } =
    useContext(SubjectContext);

  // Busca a versão mais atualizada da matéria no context
  const currentSubject = subjects.find((s) => s.id === initialSubject?.id) || initialSubject;

  // Estados para Modal de Adicionar Nota/Avaliação
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [gradeTitle, setGradeTitle] = useState('');
  const [gradeWeight, setGradeWeight] = useState('5');
  const [gradeValue, setGradeValue] = useState('');

  // Estados para Foto em tela cheia
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!currentSubject) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text>Disciplina não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.primary, marginTop: 10 }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // RECURSO NATIVO: Tirar foto usando a CÂMERA do dispositivo
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de acesso à câmera para fotografar o quadro/anotação.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await addPhotoToSubject(currentSubject.id, {
          uri: result.assets[0].uri,
          title: `Anotação de Aula (${new Date().toLocaleDateString('pt-BR')})`,
        });
        Alert.alert('Sucesso!', 'Foto capturada pela câmera e salva nas anotações da disciplina.');
      }
    } catch (err) {
      Alert.alert('Câmera', 'Não foi possível acionar a câmera no momento.');
    }
  };

  // RECURSO NATIVO: Escolher foto da GALERIA do dispositivo
  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de acesso à galeria para selecionar resumos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await addPhotoToSubject(currentSubject.id, {
          uri: result.assets[0].uri,
          title: `Resumo Importado (${new Date().toLocaleDateString('pt-BR')})`,
        });
        Alert.alert('Sucesso!', 'Imagem anexada com sucesso às anotações da disciplina.');
      }
    } catch (err) {
      Alert.alert('Galeria', 'Não foi possível acessar as imagens do aparelho.');
    }
  };

  // Adicionar Nova Avaliação/Nota
  const handleAddGrade = async () => {
    if (!gradeTitle.trim() || !gradeValue.trim()) {
      Alert.alert('Validação', 'Informe a descrição da avaliação e a nota obtida.');
      return;
    }

    const val = parseFloat(gradeValue.replace(',', '.'));
    const w = parseFloat(gradeWeight.replace(',', '.')) || 1;

    if (isNaN(val) || val < 0 || val > 10) {
      Alert.alert('Validação', 'A nota deve estar entre 0.0 e 10.0.');
      return;
    }

    const newGrade = {
      id: `grade_${Date.now()}`,
      title: gradeTitle.trim(),
      weight: w,
      grade: val,
    };

    const updatedGrades = [...(currentSubject.grades || []), newGrade];
    await updateSubject(currentSubject.id, { grades: updatedGrades });

    setGradeTitle('');
    setGradeValue('');
    setGradeWeight('5');
    setGradeModalVisible(false);
    Alert.alert('Nota Registrada!', 'Média da disciplina recalculada automaticamente.');
  };

  // Controle de Faltas (+ e -)
  const handleUpdateAbsences = async (delta) => {
    const current = currentSubject.absences || 0;
    const next = Math.max(0, current + delta);
    await updateSubject(currentSubject.id, { absences: next });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentSubject.code}
        </Text>
        <TouchableOpacity
          style={styles.bookSearchHeaderBtn}
          onPress={() => navigation.navigate('Biblioteca', { query: currentSubject.name })}
        >
          <Ionicons name="library-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner da Disciplina */}
        <View style={[styles.heroCard, { borderTopColor: currentSubject.color || COLORS.primary }]}>
          <Text style={styles.subjectName}>{currentSubject.name}</Text>
          <Text style={styles.professorText}>
            <Ionicons name="person" size={14} color={COLORS.primary} /> {currentSubject.professor}
          </Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.detailText}>{currentSubject.schedule}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.detailText}>{currentSubject.room}</Text>
            </View>
          </View>

          {/* Resumo de Notas e Faltas */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Média Ponderada</Text>
              <Text style={styles.summaryValue}>{currentSubject.average?.toFixed(1) || '0.0'}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Situação</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      currentSubject.status === 'Aprovado' ? COLORS.success : COLORS.primary,
                  },
                ]}
              >
                {currentSubject.status}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Faltas Registradas</Text>
              <View style={styles.absenceControls}>
                <TouchableOpacity onPress={() => handleUpdateAbsences(-1)}>
                  <Ionicons name="remove-circle-outline" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
                <Text style={styles.absenceNumber}>
                  {currentSubject.absences || 0}/{currentSubject.maxAbsences || 8}
                </Text>
                <TouchableOpacity onPress={() => handleUpdateAbsences(1)}>
                  <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* RECURSO DE HARDWARE: CÂMERA E ANOTAÇÕES DE AULA */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Caderno & Anotações Fotográficas</Text>
              <Text style={styles.sectionSub}>Fotografe o quadro, slides e livros de estudo</Text>
            </View>
          </View>

          {/* Botões de Ação da Câmera / Galeria */}
          <View style={styles.cameraActionsRow}>
            <TouchableOpacity
              style={styles.cameraPrimaryBtn}
              onPress={handleTakePhoto}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={18} color="#FFF" />
              <Text style={styles.cameraPrimaryBtnText}>Tirar Foto (Câmera)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraSecondaryBtn}
              onPress={handlePickFromGallery}
              activeOpacity={0.8}
            >
              <Ionicons name="images-outline" size={18} color={COLORS.primary} />
              <Text style={styles.cameraSecondaryBtnText}>Importar da Galeria</Text>
            </TouchableOpacity>
          </View>

          {/* Galeria de Fotos Anexadas */}
          {currentSubject.photos && currentSubject.photos.length > 0 ? (
            <View style={styles.photosGrid}>
              {currentSubject.photos.map((item) => (
                <View key={item.id} style={styles.photoItem}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setSelectedPhoto(item)}
                  >
                    <Image source={{ uri: item.uri }} style={styles.photoThumbnail} />
                  </TouchableOpacity>

                  <View style={styles.photoCaption}>
                    <Text style={styles.photoTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.photoDate}>{item.date}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deletePhotoBadge}
                    onPress={() => {
                      Alert.alert('Excluir Foto', 'Remover esta foto das anotações?', [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Excluir',
                          style: 'destructive',
                          onPress: () => removePhotoFromSubject(currentSubject.id, item.id),
                        },
                      ]);
                    }}
                  >
                    <Ionicons name="trash" size={14} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyPhotosBox}>
              <Ionicons name="camera-outline" size={32} color={COLORS.border} />
              <Text style={styles.emptyPhotosText}>
                Nenhuma foto do quadro anexada ainda.{'\n'}Use o botão acima para fotografar suas anotações!
              </Text>
            </View>
          )}
        </View>

        {/* Avaliações e Notas */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Avaliações e Notas</Text>
              <Text style={styles.sectionSub}>Pesos e notas para cálculo da média semestral</Text>
            </View>
            <TouchableOpacity
              style={styles.addGradeBtn}
              onPress={() => setGradeModalVisible(true)}
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
              <Text style={styles.addGradeBtnText}>Nova Nota</Text>
            </TouchableOpacity>
          </View>

          {currentSubject.grades && currentSubject.grades.length > 0 ? (
            currentSubject.grades.map((g) => (
              <View key={g.id} style={styles.gradeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gradeTitle}>{g.title}</Text>
                  <Text style={styles.gradeWeight}>Peso: {g.weight}</Text>
                </View>
                <View style={styles.gradePill}>
                  <Text style={styles.gradeValueText}>{parseFloat(g.grade).toFixed(1)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyNotesText}>Nenhuma avaliação cadastrada ainda.</Text>
          )}
        </View>

        {/* Atalho para API do Google Books */}
        <TouchableOpacity
          style={styles.booksRefBanner}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Biblioteca', { query: currentSubject.name })}
        >
          <View style={styles.booksRefIcon}>
            <Ionicons name="book" size={22} color="#7E22CE" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.booksRefTitle}>Ver Bibliografia no Google Books</Text>
            <Text style={styles.booksRefSub}>
              Buscar livros acadêmicos sobre "{currentSubject.name}" via API externa.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#7E22CE" />
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PARA ADICIONAR NOTA */}
      <Modal
        visible={gradeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGradeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Adicionar Avaliação</Text>
            <Text style={styles.modalSubheading}>
              Cadastre a atividade e sua nota para cálculo automático.
            </Text>

            <Text style={styles.inputLabel}>Título da Avaliação</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Prova Semestral, Trabalho Prático"
              value={gradeTitle}
              onChangeText={setGradeTitle}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Nota (0 a 10)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex: 8.5"
                  keyboardType="numeric"
                  value={gradeValue}
                  onChangeText={setGradeValue}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Peso (1 a 10)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex: 5"
                  keyboardType="numeric"
                  value={gradeWeight}
                  onChangeText={setGradeWeight}
                />
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setGradeModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleAddGrade}>
                <Text style={styles.modalConfirmText}>Salvar Nota</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL FOTO FULL-SCREEN */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.fullPhotoOverlay}>
          <TouchableOpacity
            style={styles.closeFullPhotoBtn}
            onPress={() => setSelectedPhoto(null)}
          >
            <Ionicons name="close" size={26} color="#FFF" />
          </TouchableOpacity>
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.fullPhotoImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  bookSearchHeaderBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
    gap: 12,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 5,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  professorText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    marginTop: 4,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  absenceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  absenceNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  cameraActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  cameraPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  cameraPrimaryBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cameraSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  cameraSecondaryBtnText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: 110,
  },
  photoCaption: {
    padding: 6,
  },
  photoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  photoDate: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  deletePhotoBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPhotosBox: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  emptyPhotosText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  addGradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 2,
  },
  addGradeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  gradeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  gradeWeight: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  gradePill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  gradeValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  emptyNotesText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 10,
  },
  booksRefBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    gap: 10,
  },
  booksRefIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  booksRefTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B21A8',
  },
  booksRefSub: {
    fontSize: 11,
    color: '#7E22CE',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalSubheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    fontSize: 13,
    color: COLORS.text,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  fullPhotoOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullPhotoBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullPhotoImage: {
    width: '100%',
    height: '80%',
  },
});
