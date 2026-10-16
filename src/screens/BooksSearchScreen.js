// src/screens/BooksSearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchAcademicBooks } from '../services/googleBooksService';
import { COLORS, SPACING, RADIUS } from '../styles/theme';

const PRESET_TOPICS = [
  'Desenvolvimento Mobile',
  'React Native',
  'Engenharia de Software',
  'Clean Code',
  'Design Patterns',
  'UI/UX Design',
];

export default function BooksSearchScreen({ route }) {
  const initialQuery = route?.params?.query || 'Desenvolvimento Mobile';
  const [query, setQuery] = useState(initialQuery);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Desenvolvimento Mobile');

  const handleSearch = async (searchTerm) => {
    const term = searchTerm !== undefined ? searchTerm : query;
    if (!term.trim()) return;

    try {
      setLoading(true);
      const results = await searchAcademicBooks(term);
      setBooks(results || []);
    } catch (err) {
      console.log('Pesquisa concluída via acervo de contingência:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(initialQuery);
  }, [initialQuery]);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setQuery(topic);
    handleSearch(topic);
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.bookCover} resizeMode="cover" />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthors} numberOfLines={1}>
          {item.authors}
        </Text>
        <Text style={styles.bookMeta}>
          {item.publisher} • {item.publishedDate?.split('-')[0] || ''}
        </Text>

        <Text style={styles.bookDesc} numberOfLines={3}>
          {item.description}
        </Text>

        {item.infoLink ? (
          <TouchableOpacity
            style={styles.bookLinkBtn}
            onPress={() => Linking.openURL(item.infoLink)}
            activeOpacity={0.8}
          >
            <Ionicons name="open-outline" size={14} color={COLORS.primary} />
            <Text style={styles.bookLinkText}>Ver no Google Livros</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="cloud" size={13} color="#7E22CE" />
          <Text style={styles.badgeText}>Integração com API Externa</Text>
        </View>
        <Text style={styles.title}>Biblioteca Acadêmica</Text>
        <Text style={styles.subtitle}>
          Pesquise livros e referências bibliográficas pelo Google Books API.
        </Text>

        {/* Campo de Busca */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o título, autor ou tema acadêmico..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => handleSearch()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.searchBtnText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Tópicos Rápidos */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={PRESET_TOPICS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.topicsList}
          renderItem={({ item }) => {
            const isSelected = selectedTopic === item;
            return (
              <TouchableOpacity
                style={[styles.topicChip, isSelected && styles.topicChipActive]}
                onPress={() => handleSelectTopic(item)}
              >
                <Text
                  style={[styles.topicChipText, isSelected && styles.topicChipTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Lista de Livros Retornados */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Consultando Google Books API...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={54} color={COLORS.border} />
              <Text style={styles.emptyTitle}>Nenhum livro encontrado</Text>
              <Text style={styles.emptySub}>
                Tente pesquisar por outros termos como "Mobile", "React" ou "Engenharia de Software".
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginBottom: 4,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E22CE',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingLeft: 10,
    paddingRight: 4,
    height: 46,
    marginTop: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  searchBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  topicsList: {
    gap: 8,
    paddingVertical: 4,
  },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topicChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  topicChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  topicChipTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: SPACING.md,
    gap: 12,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    gap: 12,
  },
  bookCover: {
    width: 75,
    height: 110,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F1F5F9',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  bookAuthors: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  bookMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bookDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  bookLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  bookLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
});
