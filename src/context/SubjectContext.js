// src/context/SubjectContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SubjectContext = createContext({});

const STORAGE_KEY = '@studyflow_subjects_data';

export const INITIAL_SUBJECTS = [
  {
    id: 'subj_1',
    name: 'Desenvolvimento de Aplicativos Móveis',
    code: 'DAM-2026',
    professor: 'Prof. Diogo Rodrigues',
    room: 'Laboratório Mobile / Remoto',
    schedule: 'Sábados, 08h00 - 12h00',
    workload: 60,
    color: '#4F46E5', // Índigo
    grades: [
      { id: 'g1', title: 'Projeto Prático Mobile (App Completo)', weight: 6, grade: 9.5 },
      { id: 'g2', title: 'Artigo e Documentação Técnica', weight: 4, grade: 9.0 },
    ],
    average: 9.3,
    status: 'Aprovado',
    absences: 0,
    maxAbsences: 8,
    notes: 'Disciplina voltada à criação de aplicativos completos em React Native / Flutter com boas práticas de UI/UX, APIs e hardware nativo.',
    photos: [
      {
        id: 'p1',
        uri: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        title: 'Arquitetura de Telas e Navegação',
        date: '10/10/2026',
      },
    ],
  },
  {
    id: 'subj_2',
    name: 'UX/UI Design para Interfaces Móveis',
    code: 'UXD-2026',
    professor: 'Profa. Camila Duarte',
    room: 'Sala 204',
    schedule: 'Quartas, 19h00 - 22h00',
    workload: 45,
    color: '#06B6D4', // Ciano
    grades: [
      { id: 'g3', title: 'Prototipação no Figma', weight: 5, grade: 8.5 },
      { id: 'g4', title: 'Teste de Usabilidade Heurística', weight: 5, grade: 8.0 },
    ],
    average: 8.25,
    status: 'Aprovado',
    absences: 1,
    maxAbsences: 6,
    notes: 'Diretrizes de Material Design e Human Interface Guidelines para dispositivos móveis.',
    photos: [],
  },
  {
    id: 'subj_3',
    name: 'Arquitetura em Nuvem e Microsserviços',
    code: 'ARC-2026',
    professor: 'Prof. Marcelo Siqueira',
    room: 'Lab 02',
    schedule: 'Segundas, 19h00 - 22h00',
    workload: 60,
    color: '#10B981', // Verde
    grades: [
      { id: 'g5', title: 'Implementação de APIs RESTful', weight: 6, grade: 7.5 },
    ],
    average: 7.5,
    status: 'Em Curso',
    absences: 2,
    maxAbsences: 8,
    notes: 'Deploy em cloud, bancos NoSQL, autenticação JWT e escalabilidade.',
    photos: [],
  },
];

// Função auxiliar para recalcular média e status
function calculateAverageAndStatus(grades) {
  if (!grades || grades.length === 0) {
    return { average: 0, status: 'Em Curso' };
  }

  let totalWeight = 0;
  let weightedSum = 0;

  grades.forEach((g) => {
    const w = parseFloat(g.weight) || 1;
    const v = parseFloat(g.grade) || 0;
    weightedSum += v * w;
    totalWeight += w;
  });

  const avg = totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(1)) : 0;
  let status = 'Em Curso';

  if (totalWeight >= 10) {
    status = avg >= 7.0 ? 'Aprovado' : 'Recuperação';
  }

  return { average: avg, status };
}

export function SubjectProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega matérias salvas ou restaura iniciais
  useEffect(() => {
    async function loadSubjects() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSubjects(JSON.parse(stored));
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBJECTS));
          setSubjects(INITIAL_SUBJECTS);
        }
      } catch (err) {
        console.error('Erro ao carregar matérias:', err);
        setSubjects(INITIAL_SUBJECTS);
      } finally {
        setIsLoading(false);
      }
    }

    loadSubjects();
  }, []);

  const saveToStorage = async (list) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Erro ao salvar matérias:', e);
    }
  };

  // CRUD: CREATE
  const addSubject = async (subjectData) => {
    const grades = subjectData.grades || [];
    const { average, status } = calculateAverageAndStatus(grades);

    const newSubject = {
      id: `subj_${Date.now()}`,
      grades,
      average,
      status,
      absences: 0,
      maxAbsences: 8,
      photos: [],
      color: subjectData.color || '#4F46E5',
      ...subjectData,
    };

    const updated = [newSubject, ...subjects];
    setSubjects(updated);
    await saveToStorage(updated);
    return newSubject;
  };

  // CRUD: UPDATE
  const updateSubject = async (id, updatedFields) => {
    const updated = subjects.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...updatedFields };
        const { average, status } = calculateAverageAndStatus(merged.grades || []);
        merged.average = average;
        merged.status = status;
        return merged;
      }
      return item;
    });

    setSubjects(updated);
    await saveToStorage(updated);
  };

  // CRUD: DELETE
  const deleteSubject = async (id) => {
    const updated = subjects.filter((item) => item.id !== id);
    setSubjects(updated);
    await saveToStorage(updated);
  };

  // CRUD: Adicionar Foto tirada com a Câmera
  const addPhotoToSubject = async (subjectId, photoData) => {
    const newPhoto = {
      id: `photo_${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      title: photoData.title || 'Anotação de Aula',
      uri: photoData.uri,
    };

    const updated = subjects.map((subj) => {
      if (subj.id === subjectId) {
        const photos = [newPhoto, ...(subj.photos || [])];
        return { ...subj, photos };
      }
      return subj;
    });

    setSubjects(updated);
    await saveToStorage(updated);
    return newPhoto;
  };

  // CRUD: Remover Foto
  const removePhotoFromSubject = async (subjectId, photoId) => {
    const updated = subjects.map((subj) => {
      if (subj.id === subjectId) {
        const photos = (subj.photos || []).filter((p) => p.id !== photoId);
        return { ...subj, photos };
      }
      return subj;
    });

    setSubjects(updated);
    await saveToStorage(updated);
  };

  // Restaurar dados originais para teste da banca
  const resetToDefaultSubjects = async () => {
    await saveToStorage(INITIAL_SUBJECTS);
    setSubjects(INITIAL_SUBJECTS);
  };

  // Estatísticas gerais calculadas
  const totalSubjects = subjects.length;
  const approvedCount = subjects.filter((s) => s.status === 'Aprovado').length;
  const overallCRA =
    subjects.length > 0
      ? (
          subjects.reduce((sum, s) => sum + (s.average || 0), 0) / subjects.length
        ).toFixed(2)
      : '0.00';

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        isLoading,
        totalSubjects,
        approvedCount,
        overallCRA,
        addSubject,
        updateSubject,
        deleteSubject,
        addPhotoToSubject,
        removePhotoFromSubject,
        resetToDefaultSubjects,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
}
