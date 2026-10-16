// src/services/googleBooksService.js

// Acervo acadêmico pré-carregado para fallback garantido e funcionamento offline
const FALLBACK_ACADEMIC_BOOKS = [
  {
    id: 'fb_1',
    title: 'React Native in Action',
    subtitle: 'Developing iOS and Android apps with JavaScript',
    authors: 'Nader Dabit',
    publisher: 'Manning Publications',
    publishedDate: '2019',
    pageCount: 330,
    categories: 'Computação & Mobile',
    description: 'Guia prático e aprofundado para criação de aplicações móveis modernas com React Native, gerenciamento de estado e recursos nativos.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    infoLink: 'https://openlibrary.org/search?q=react+native',
  },
  {
    id: 'fb_2',
    title: 'Clean Architecture: O Guia do Artesão para Estrutura e Design de Software',
    subtitle: 'Arquitetura Limpa e Boas Práticas',
    authors: 'Robert C. Martin (Uncle Bob)',
    publisher: 'Alta Books',
    publishedDate: '2019',
    pageCount: 432,
    categories: 'Engenharia de Software',
    description: 'Princípios fundamentais de design de software, independência de frameworks e manutenibilidade para desenvolvedores profissionais.',
    thumbnail: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=400&q=80',
    infoLink: 'https://openlibrary.org/search?q=clean+architecture',
  },
  {
    id: 'fb_3',
    title: 'Não Me Faça Pensar: Uma Abordagem de Bom Senso à Usabilidade',
    subtitle: 'Atualizado para Mobile e Web',
    authors: 'Steve Krug',
    publisher: 'Alta Books',
    publishedDate: '2014',
    pageCount: 216,
    categories: 'UI/UX Design',
    description: 'Clássico mundial sobre princípios de usabilidade, design intuitivo e navegação simplificada em interfaces digitais.',
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
    infoLink: 'https://openlibrary.org/search?q=dont+make+me+think',
  },
  {
    id: 'fb_4',
    title: 'Padrões de Projeto: Soluções Reutilizáveis de Software Orientado a Objetos',
    subtitle: 'Design Patterns clássicos do GoF',
    authors: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    publisher: 'Bookman',
    publishedDate: '2000',
    pageCount: 384,
    categories: 'Padrões de Projeto',
    description: 'Catálogo fundamental de 23 padrões de projeto de software que resolvem problemas comuns de arquitetura e desacoplamento.',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    infoLink: 'https://openlibrary.org/search?q=design+patterns',
  },
  {
    id: 'fb_5',
    title: 'Aprendendo Node.js: Edição para Desenvolvedores Mobile & Fullstack',
    subtitle: 'Construindo APIs RESTful e Microsserviços',
    authors: 'Shelley Powers',
    publisher: 'Novatec',
    publishedDate: '2020',
    pageCount: 304,
    categories: 'Backend & APIs',
    description: 'Criação de servidores e APIs performáticas com Node.js para alimentar aplicativos móveis com escalabilidade e segurança.',
    thumbnail: 'https://images.unsplash.com/photo-1507842229458-77997a477d61?auto=format&fit=crop&w=400&q=80',
    infoLink: 'https://openlibrary.org/search?q=nodejs',
  },
];

/**
 * Busca livros via Open Library API (sem limite de requisições / 429)
 */
async function fetchFromOpenLibrary(query) {
  const encoded = encodeURIComponent(query.trim());
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encoded}&limit=10`
  );

  if (!response.ok) {
    throw new Error(`Open Library respondeu com status ${response.status}`);
  }

  const data = await response.json();
  const docs = data.docs || [];

  if (docs.length === 0) {
    return [];
  }

  return docs.map((doc, index) => {
    const authors = doc.author_name ? doc.author_name.slice(0, 2).join(', ') : 'Autor Acadêmico';
    const year = doc.first_publish_year ? String(doc.first_publish_year) : 'Recente';
    const publisher = doc.publisher ? doc.publisher[0] : 'Editora Acadêmica';

    let thumbnail =
      doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

    return {
      id: doc.key || `ol_${index}_${Date.now()}`,
      title: doc.title || 'Livro Acadêmico',
      subtitle: doc.subtitle || '',
      authors,
      publisher,
      publishedDate: year,
      pageCount: doc.number_of_pages_median || 280,
      categories: query,
      description: `Publicação acadêmica relevante sobre "${query}", ideal para estudo, aprofundamento e referências bibliográficas do curso.`,
      thumbnail,
      infoLink: doc.key ? `https://openlibrary.org${doc.key}` : 'https://openlibrary.org',
    };
  });
}

/**
 * Consulta a API externa com fallback automático em caso de rate-limit (429)
 * 1º Tenta Google Books API
 * 2º Se der 429 (Too Many Requests), consulta a Open Library API
 * 3º Se estiver offline ou sem conexão, retorna acervo acadêmico curado
 */
export async function searchAcademicBooks(query = 'Desenvolvimento Mobile') {
  if (!query || query.trim().length === 0) {
    return FALLBACK_ACADEMIC_BOOKS;
  }

  // 1. Tentar Google Books API
  try {
    const encoded = encodeURIComponent(query.trim());
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encoded}&maxResults=10&printType=books`
    );

    if (response.status === 429) {
      console.log('Google Books retornou 429 (Rate Limit). Acionando Open Library API...');
      return await fetchFromOpenLibrary(query);
    }

    if (!response.ok) {
      console.log(`Google Books retornou status ${response.status}. Acionando Open Library API...`);
      return await fetchFromOpenLibrary(query);
    }

    const data = await response.json();
    const items = data.items || [];

    if (items.length === 0) {
      return await fetchFromOpenLibrary(query);
    }

    return items.map((item) => {
      const info = item.volumeInfo || {};
      const imageLinks = info.imageLinks || {};

      let thumbnail =
        imageLinks.thumbnail ||
        imageLinks.smallThumbnail ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

      if (thumbnail.startsWith('http://')) {
        thumbnail = thumbnail.replace('http://', 'https://');
      }

      return {
        id: item.id,
        title: info.title || 'Título Indisponível',
        subtitle: info.subtitle || '',
        authors: info.authors ? info.authors.join(', ') : 'Autor Acadêmico',
        publisher: info.publisher || 'Editora Acadêmica',
        publishedDate: info.publishedDate || 'Recente',
        pageCount: info.pageCount || 0,
        categories: info.categories ? info.categories.join(', ') : query,
        description:
          info.description ||
          `Referência acadêmica recomendada para aprofundamento nos tópicos de ${query}.`,
        thumbnail,
        infoLink: info.infoLink || info.previewLink || '',
      };
    });
  } catch (error) {
    // 2. Fallback para Open Library API
    try {
      console.log('Tentando Open Library API após erro na Google Books API...');
      const openLibResults = await fetchFromOpenLibrary(query);
      if (openLibResults.length > 0) {
        return openLibResults;
      }
    } catch (openLibErr) {
      console.warn('Erro na Open Library API:', openLibErr.message);
    }

    // 3. Fallback Offline com livros curados filtrados por query
    const lowerQ = query.toLowerCase();
    const filtered = FALLBACK_ACADEMIC_BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerQ) ||
        b.authors.toLowerCase().includes(lowerQ) ||
        b.categories.toLowerCase().includes(lowerQ)
    );

    return filtered.length > 0 ? filtered : FALLBACK_ACADEMIC_BOOKS;
  }
}
