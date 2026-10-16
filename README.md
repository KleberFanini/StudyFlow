# 📚 StudyFlow - Assistente de Produtividade Acadêmica

> **Projeto de Desenvolvimento de Aplicativos Móveis**  
> **Instituição:** Faculdade FAFIRE  
> **Docente:** Prof. Diogo Rodrigues  
> **Tema Escolhido:** Ferramenta de Produtividade para Estudantes  
> **Versão do Ecossistema:** Expo SDK 57 (Compatível nativamente com Expo Go 57.0.9)  

---

## 📌 1. Visão Geral do Projeto

O **StudyFlow** é um aplicativo móvel completo projetado para auxiliar estudantes de graduação e pós-graduação no gerenciamento da sua vida acadêmica. A aplicação permite:

- Organizar e gerenciar as **disciplinas do semestre** com seus respectivos códigos, docentes, horários e salas.
- Acompanhar **notas, pesos de avaliações e cálculo automático de médias e CRA (Coeficiente de Rendimento Acadêmico)**.
- Fotografar a lousa/quadro em sala de aula, livros ou resumos manuscritos através da **Câmera do dispositivo móvel**, vinculando as fotos diretamente à matéria.
- Consultar em tempo real referências bibliográficas recomendadas e sinopses através da **Google Books API**.
- Operar em **modo offline** sem interrupção através de persistência local contínua.

---

## ✅ 2. Mapeamento dos Requisitos Técnicos do Edital

| Requisito do Edital | Situação | Implementação no StudyFlow |
| :--- | :---: | :--- |
| **Plataformas iOS e/ou Android** | ✅ Concluído | Desenvolvido com Expo SDK 57, 100% multiplataforma (Android, iOS e Web). |
| **Pelo menos 5 telas com navegação** | ✅ Concluído | **7 Telas:** `WelcomeScreen`, `LoginScreen`, `RegisterScreen`, `DashboardScreen`, `SubjectsScreen` (CRUD), `SubjectDetailsScreen` (com Câmera), `BooksSearchScreen` (API) e `ProfileScreen`. |
| **Persistência de Dados (Local e/ou Remota)** | ✅ Concluído | Armazenamento contínuo em `@react-native-async-storage/async-storage` para sessão do aluno, matérias cadastradas, notas e fotos. |
| **Design Responsivo** | ✅ Concluído | Layout adaptável a qualquer tamanho de tela mobile e visualização web. |
| **Autenticação (Login/Cadastro)** | ✅ Concluído | `AuthContext` com fluxo completo de login, cadastro, logout e persistência de sessão. |
| **CRUD Completo de Entidade** | ✅ Concluído | Entidade **Disciplina / Matéria**: **Criar**, **Listar**, **Editar** e **Excluir** com confirmação de segurança e recálculo de médias. |
| **Integração com API Externa** | ✅ Concluído | **Google Books API** (`https://www.googleapis.com/books/v1/volumes`) com busca instantânea de livros e sinopses. |
| **Recursos Nativos de Dispositivos Móveis** | ✅ Concluído | **Câmera e Galeria** (`expo-image-picker`) para fotografar o quadro em aula e anexar às anotações da disciplina. |
| **Modo Offline** | ✅ Concluído | O aplicativo mantém todas as notas, matérias e anotações funcionais mesmo sem internet. |
| **Interface e UX Mobile** | ✅ Concluído | Design moderno inspirado no Notion/Linear com ícones vetoriais `@expo/vector-icons` e tipografia limpa. |

---

## 📱 3. Telas do Aplicativo

1. **Boas-vindas (`WelcomeScreen`):** Apresentação das funcionalidades de produtividade e botões de acesso.
2. **Login (`LoginScreen`):** Entrada rápida para estudantes e botão de **"Acesso Rápido de Teste (Aluno Demo)"** para agilizar a avaliação da banca em 1 clique.
3. **Cadastro (`RegisterScreen`):** Cadastro do aluno com faculdade, curso e período letivo.
4. **Painel do Aluno (`DashboardScreen`):** Visão geral com cálculo do CRA, quantidade de matérias aprovadas, alertas de prazos e atalhos rápidos.
5. **Gerenciador de Disciplinas (`SubjectsScreen`):** Tela exclusiva de **CRUD** onde é possível criar novas matérias, alterar informações, acompanhar médias e excluir matérias.
6. **Caderno & Detalhes da Matéria (`SubjectDetailsScreen`):** Tela rica com:
   - Galeria fotográfica com acionamento da **Câmera** do celular para tirar fotos do quadro.
   - Adição de avaliações com pesos e cálculo automático de média.
   - Contador de faltas com limite semestral.
7. **Biblioteca Virtual (`BooksSearchScreen`):** Integração com a **Google Books API** com busca de livros acadêmicos por palavras-chave ou tópicos recomendados.
8. **Meu Perfil (`ProfileScreen`):** Informações do estudante, matrícula, estatísticas acadêmicas e créditos institucionais da FAFIRE.

---

## 🚀 4. Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Aplicativo **Expo Go** instalado no celular (**versão 57.0.9**).

### Passo a Passo

1. **Instalar dependências (já travadas na SDK 57):**
   ```bash
   npm install
   ```

2. **Iniciar o Expo:**
   ```bash
   npx expo start
   ```

3. **Abrir no celular:**
   - Abra o **Expo Go** no smartphone e aponte a câmera para o QR Code gerado no terminal.
   - O aplicativo abrirá instantaneamente sem nenhum aviso de incompatibilidade de versão.

4. **Ou executar no navegador (Web):**
   ```bash
   npx expo start --web
   ```

---

## 🔑 5. Credenciais de Teste da Banca

Para testar sem precisar preencher formulários manualmente:
- Clique no botão **"Acesso Rápido de Teste (Aluno Demo)"** na tela de Login.
