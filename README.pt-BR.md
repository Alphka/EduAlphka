# EduAlphka

> **Language / Idioma:** [English](README.md) | **Português (Brasil)**
>
> *If you prefer to read this documentation in English, [click here](README.md).*

<div align="center">
	<a href="https://github.com/Alphka/EduAlphka">
		<img src="src/app/icon.svg" alt="Logotipo do EduAlphka" height="140">
	</a>
	<h3>Plataforma Online para Criação, Aplicação e Correção de Testes</h3>
	<p>
		Uma aplicação full-stack em Next.js que permite a professores e recrutadores criar<br>
		testes personalizados, distribuí-los por meio de links de convite seguros e corrigi-los<br>
		automática ou manualmente, mantendo o cronômetro totalmente fora do controle do candidato.
	</p>
</div>

<br>

<p align="center">
	<img alt="Licença" src="https://img.shields.io/badge/Licen%C3%A7a-ISC-5271FF?style=for-the-badge">
	<img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white">
	<img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
	<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
	<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
	<img alt="Mantine" src="https://img.shields.io/badge/Mantine-7-339AF0?style=for-the-badge&logo=mantine&logoColor=white">
	<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
	<img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</p>

## Sumário
- [EduAlphka](#edualphka)
  - [Sumário](#sumário)
  - [Sobre o Projeto](#sobre-o-projeto)
    - [Contexto e Problema](#contexto-e-problema)
    - [A Solução](#a-solução)
  - [Principais Funcionalidades](#principais-funcionalidades)
  - [Arquitetura do Sistema e Fluxo de Dados](#arquitetura-do-sistema-e-fluxo-de-dados)
    - [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
    - [Autenticação e Segurança de Sessão](#autenticação-e-segurança-de-sessão)
    - [Anti-Fraude: Controle de Tempo Validado no Servidor](#anti-fraude-controle-de-tempo-validado-no-servidor)
    - [Motor de Correção e Relatórios](#motor-de-correção-e-relatórios)
    - [Controle de Acesso por Convite](#controle-de-acesso-por-convite)
    - [Limpeza de Dados Agendada](#limpeza-de-dados-agendada)
  - [Modelo de Dados](#modelo-de-dados)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
    - [Frontend](#frontend)
    - [Backend e Dados](#backend-e-dados)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Como Executar o Projeto](#como-executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação](#instalação)
    - [Variáveis de Ambiente](#variáveis-de-ambiente)
    - [Executando a Aplicação](#executando-a-aplicação)
  - [Capturas de Tela](#capturas-de-tela)
    - [Login e Registro](#login-e-registro)
    - [Formulário de Criação de Teste](#formulário-de-criação-de-teste)
    - [Painel do Professor](#painel-do-professor)
    - [Tela de Correção](#tela-de-correção)
  - [Ideias para o Futuro](#ideias-para-o-futuro)
  - [Contexto Acadêmico e Créditos](#contexto-acadêmico-e-créditos)
  - [Licença](#licença)

## Sobre o Projeto

### Contexto e Problema
Nos últimos anos, houve um crescimento expressivo da avaliação remota, tanto em contextos educacionais quanto corporativos, o que torna essencial a aplicação e a correção automatizada dessas avaliações. Organizar, distribuir, cronometrar e corrigir provas manualmente, principalmente em larga escala, é lento, suscetível a erros e difícil de manter justo para todos os candidatos.

### A Solução
O **EduAlphka** é uma plataforma web para criação, aplicação e correção de testes online, voltada tanto para avaliações educacionais quanto para processos seletivos corporativos. Um **professor** (aplicador de testes) monta um teste combinando questões objetivas (múltipla escolha) e dissertativas, pode marcar qualquer uma delas como opcional, define um tempo limite e compartilha o teste por meio de um link de convite exclusivo. O **candidato** responde ao teste dentro dessa janela de tempo, que é controlada no servidor e não apenas no navegador, e recebe feedback imediato das questões objetivas assim que envia suas respostas. Caso o teste tenha questões dissertativas obrigatórias, a nota final só é publicada depois que o professor as corrige manualmente.

O projeto foi pensado para ser utilizado tanto por instituições de ensino que avaliam alunos quanto por empresas que conduzem processos seletivos, sem exigir uma ferramenta diferente para cada contexto.

## Principais Funcionalidades
- **Dois tipos de conta**: professor (aplicador de testes) e candidato, cada um com controle de acesso a rotas e ações conforme o perfil.
- **Criação de testes personalizados**: título, descrição, disciplina, duração, data de início opcional e data de término opcional, além de uma lista ordenada de questões.
- **Dois tipos de questão**: múltipla escolha (com correção automática a partir da opção correta) e dissertativa (texto livre, corrigida manualmente).
- **Questões obrigatórias e opcionais**: questões opcionais nunca entram na nota final e nunca ficam pendentes de correção manual.
- **Links de convite seguros**: cada teste possui um token de convite único e regenerável, e o acesso pode ser revogado por candidato através de uma lista negra que persiste mesmo após a geração de um novo link.
- **Painel de gerenciamento de testes**: listar os testes criados, editá-los enquanto nenhum candidato tiver começado a respondê-los, excluí-los e acompanhar quais candidatos já enviaram respostas e quais submissões ainda aguardam correção.
- **Fluxo de correção manual**: o professor corrige as respostas dissertativas, adiciona feedback escrito e publica o resultado quando estiver pronto. O modelo de dados já suporta múltiplos corretores por meio do documento `Submit` compartilhado.
- **Cronômetro validado no servidor**: a contagem regressiva exibida ao candidato é apenas uma conveniência visual. A plataforma recalcula de forma independente se o teste ainda está disponível a cada requisição (veja [Anti-Fraude](#anti-fraude-controle-de-tempo-validado-no-servidor)).
- **Feedback imediato e parcial**: o resultado das questões objetivas é exibido logo após o envio. Se houver correção dissertativa pendente, o candidato vê uma nota parcial até que ela seja publicada.
- **Análises do desempenho do teste**: nota média, tempo médio de conclusão e percentual de acerto por questão são calculados via pipelines de agregação do MongoDB e exibidos com Recharts e Mantine Charts.
- **Notificações internas**: os candidatos são avisados quando a correção de suas respostas dissertativas é concluída, e a preferência pode ser configurada por usuário.
- **Recuperação de senha por e-mail**: um código de verificação de uso único é enviado via SMTP do Gmail para redefinir uma senha esquecida.
- **Limpeza de dados agendada**: uma rotina semanal remove sessões e códigos de verificação expirados, além de qualquer documento órfão deixado por um usuário ou teste excluído.
- **Interface responsiva e acessível**: construída com Mantine e Tailwind CSS, seguindo os requisitos de acessibilidade e responsividade definidos no plano de desenvolvimento do software.

## Arquitetura do Sistema e Fluxo de Dados

### Visão Geral da Arquitetura
O EduAlphka é construído sobre o **App Router do Next.js**, combinando páginas renderizadas no servidor, Server Actions para mutações e Route Handlers para a API de manutenção. Toda a persistência passa pelo **Mongoose**, em um cluster **MongoDB Atlas**.

```mermaid
flowchart TD
    subgraph Clients["Clientes"]
        Prof["Professor / Recrutador<br/>(cria e corrige testes)"]
        Cand["Candidato<br/>(realiza testes via link de convite)"]
    end

    subgraph App["EduAlphka - Next.js 15 (App Router)"]
        MW["Middleware<br/>Propagação de token + cabeçalhos de segurança"]
        UI["Componentes de Servidor e Cliente<br/>React 19, Mantine, Tailwind CSS"]
        SA["Server Actions & Route Handlers<br/>autenticação, CRUD de testes, submissão, correção"]
        Cron["/api/cron<br/>Endpoint de manutenção agendada"]
    end

    subgraph Data["MongoDB Atlas (ODM Mongoose)"]
        Users[("Usuários & Sessões")]
        Exams[("Testes, Questões & Convites")]
        Submits[("Submissões & Respostas")]
    end

    Mail["Nodemailer (SMTP do Gmail)<br/>Códigos de recuperação de senha"]

    Prof --> MW
    Cand --> MW
    MW --> UI
    UI --> SA
    SA --> Users
    SA --> Exams
    SA --> Submits
    SA --> Mail
    Cron -->|Vercel Cron, segundas 00:00 UTC| SA
    SA -.->|limpeza em cascata| Users
    SA -.-> Exams
    SA -.-> Submits
```

### Autenticação e Segurança de Sessão
- No login ou registro, o servidor gera um token hexadecimal de 96 caracteres (`crypto.randomBytes(48)`) e o armazena em um documento `Session`, junto com o user agent e uma data de expiração de um mês.
- O token é definido como cookie e também aceito no cabeçalho `Bearer`; o middleware valida seu formato com uma expressão regular estrita que exige exatamente 96 caracteres hexadecimais (`^[a-fA-F0-9]{96}$`) antes de repassá-lo ao restante da aplicação.
- As senhas nunca são armazenadas em texto puro. Elas são "hasheadas" com **HMAC-SHA512**, usando um salt mantido apenas no servidor:

$$
\text{passwordHash} = \text{HMAC-SHA512}(\text{password},\ \text{salt})
$$

- Toda resposta carrega cabeçalhos de segurança definidos no middleware e no `next.config.ts`: `Referrer-Policy: origin-when-cross-origin`, `X-Frame-Options: DENY`, `X-XSS-Protection` e `X-Content-Type-Options: nosniff`.
- Ao sair da conta, o documento `Session` correspondente é removido no servidor e o cookie é apagado, de forma que um token roubado deixa de funcionar imediatamente após o logout.

### Anti-Fraude: Controle de Tempo Validado no Servidor
Um dos requisitos originais do projeto era um limite de tempo que o candidato não pudesse manipular. Em vez de confiar em uma contagem regressiva feita no navegador, o EduAlphka registra um documento `StartedExam` no momento em que o candidato abre o teste e recalcula o prazo final a partir desse instante a cada requisição:

$$
\text{prazoFinal} = \text{startedExam.createdAt} + \text{exam.duration (minutos)}
$$

$$
\text{expirado} = (\text{agora} > \text{prazoFinal})\ \lor\ (\text{agora} > \text{exam.expiresAt})
$$

Como a comparação sempre acontece contra o horário salvo no banco de dados, nunca contra um valor enviado pelo navegador, pausar a aba, alterar o relógio do dispositivo ou editar o cronômetro exibido na tela não tem qualquer efeito sobre a plataforma continuar aceitando respostas.

### Motor de Correção e Relatórios
As notas e estatísticas são calculadas por meio de pipelines de agregação do MongoDB, em vez de ficarem em cache no cliente, garantindo que sempre reflitam o estado atual das submissões.

Seja $Q_r$ o conjunto de questões **obrigatórias** de um teste.

**Nota do candidato**: a contagem de questões obrigatórias respondidas corretamente (respostas dissertativas só contam depois que a correção é publicada):

$$
\text{nota} = \sum_{q \in Q_r} \mathbb{1}\left[\text{resposta}(q)\ \text{está correta}\right]
$$

**Nota média de um teste** (somente submissões publicadas são contabilizadas quando o teste possui questões dissertativas obrigatórias):

$$
\overline{\text{nota}} = \frac{\sum \text{respostasCorretas}}{\text{totalDeCandidatos}}
$$

**Percentual de acerto por questão**, usado para identificar as questões com maior índice de erro:

$$
\text{percentualAcerto}_q = \frac{\text{respostasCorretas}_q}{\text{totalDeRespostas}_q} \times 100
$$

**Tempo médio de conclusão**, calculado a partir da diferença entre o início e o envio do teste:

$$
\overline{t} = \text{média}\left(\text{submit.createdAt} - \text{startedExam.createdAt}\right)
$$

### Controle de Acesso por Convite
Os candidatos nunca navegam por uma lista pública de testes. Cada teste possui um token `ExamInvite` único; o professor compartilha esse link, e a plataforma associa o candidato ao teste no primeiro acesso. Ao remover um candidato, o seu identificador é movido para a lista negra `disallowedCandidates` do teste, de modo que gerar um novo link de convite **não** permite que um candidato removido volte a ter acesso.

### Limpeza de Dados Agendada
Um Vercel Cron aciona `GET /api/cron` toda segunda-feira às 00:00 UTC (`vercel.json`). A rotina percorre as coleções em cascata para excluir:
- sessões e códigos de recuperação de senha expirados ou órfãos;
- testes cujo proprietário não existe mais;
- convites, registros de início de teste e notificações vinculados a um teste ou usuário excluído;
- submissões e respostas vinculadas a um teste ou submissão excluída.

Isso mantém o banco de dados livre de documentos órfãos sem exigir limpeza manual, além de manter o custo de armazenamento previsível em uma implantação serverless.

## Modelo de Dados

<details>
<summary><strong>Diagrama entidade-relacionamento</strong> (clique para expandir)</summary>

```mermaid
erDiagram
    Session {
        ObjectId id PK
        String(96) token
        ObjectId user FK
        String(255) userAgent
        Date createdAt
        Date expiresAt
    }

    VerificationCode {
        ObjectId id PK
        ObjectId user FK
        String(10) code
        Date createdAt
        Date expiresAt
    }

    Notification {
        ObjectId id
        string title
        string content
        User user
        Exam exam
        User owner
        Date createdAt
        Date readAt
    }

    User {
        ObjectId id PK
        String(255) name
        String(255) email
        String(255) normalizedEmail
        String(30) username
        String(255) password
        String(255) accountType
        Date createdAt
        Date updatedAt
        Object settings
    }
    User 1--0+ Session : creates
    User 1--1+ VerificationCode : requests
    User 1+--0+ Notification : receives
    User 1--1+ Notification : sends
    User 1--0+ Exam : creates
    User 0+--0+ Exam : participates
    User 1--0+ StartedExam : starts
    User 1--0+ Submit : performs

    StartedExam {
        ObjectId id PK
        ObjectId exam FK
        ObjectId user FK
        Date createdAt
    }
    StartedExam 1--0+ Exam : refers

    Exam {
        ObjectId id PK
        ObjectId owner FK
        String(255) title
        String(355) description
        String(255) subject
        Number duration
        ObjectId[] candidates FK
        ObjectId[] disallowedCandidates FK
        Date createdAt
        Date updatedAt
        Date expiresAt
        Date startsAt
    }
    Exam 1--1+ ExamInvite : contains
    Exam 1--1+ Question : contains
    Exam 1--0+ Submit : allows

    ExamInvite {
        ObjectId id PK
        String(96) token
        ObjectId exam FK
        Date createdAt
    }

    Question {
        ObjectId id PK
        String(255) type
        String(2000) text
        Boolean isRequired
        ObjectId correctAnswer FK
        String(2000) feedback
    }
    Question 1--0+ Answer : allows
    Question 1--0+ QuestionOption : contains

    QuestionOption {
        ObjectId id PK
        String(255) text
    }

    Answer {
        ObjectId id PK
        String(255) type
        ObjectId submit FK
        ObjectId question FK
        ObjectId option FK
        String(2000) content
        Boolean isCorrect
        String(2000) feedback
        Date createdAt
        Date updatedAt
    }
    Answer 1--zero or one QuestionOption : contains

    Submit {
        ObjectId id PK
        ObjectId user FK
        ObjectId exam FK
        Date createdAt
        Date publishedAt
    }
```

</details>

O plano de desenvolvimento de software completo também inclui um diagrama conceitual e um diagrama de classes (com métodos como `isExpired()`, `getAverageGrade()` e `getQuestionCorrectPercentage()`) em [`/diagram`](diagram), exportados a partir dos mesmos schemas do MongoDB presentes em [`src/models`](src/models).

## Tecnologias Utilizadas

### Frontend
- **[Next.js 15](https://nextjs.org/)** (App Router, Turbopack em desenvolvimento): renderização híbrida e roteamento por sistema de arquivos.
- **[React 19](https://react.dev/)**: interface orientada a componentes.
- **[TypeScript](https://www.typescriptlang.org/)**: tipagem estática no cliente, servidor, models e schemas.
- **[Mantine 7](https://mantine.dev/)** (`core`, `hooks`, `dates`, `charts`): biblioteca de componentes acessíveis e gráficos de análise.
- **[Tailwind CSS 3](https://tailwindcss.com/)**: estilização utility-first, combinada com módulos Sass para estilos globais.
- **[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)**: formulários tipados e validados por schema.
- **[SWR](https://swr.vercel.app/)**: busca, cache e revalidação de dados no cliente.
- **[Recharts](https://recharts.org/)**: gráficos de desempenho dos testes.
- **[React Toastify](https://fkhadra.github.io/react-toastify/)**: feedback de interações.
- **[Day.js](https://day.js.org/)**: manipulação de datas para agendamento e cronômetro dos testes.

### Backend e Dados
- **[Server Actions e Route Handlers do Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)**: mutações e o endpoint de manutenção `/api/cron`.
- **[MongoDB Atlas](https://www.mongodb.com/atlas)**: banco de dados NoSQL na nuvem.
- **[Mongoose 8](https://mongoosejs.com/)**: definição de schemas, validação, métodos estáticos/de instância e pipelines de agregação.
- **[`crypto` do Node.js](https://nodejs.org/api/crypto.html)**: geração de tokens e hash de senha com HMAC-SHA512.
- **[Nodemailer](https://nodemailer.com/)**: envio de e-mails transacionais para recuperação de senha, via SMTP do Gmail.
- **[Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)**: limpeza semanal de dados órfãos.

## Estrutura do Projeto
```
src/
├── app/
│   ├── (overview)/        # Área autenticada: dashboard, gerenciamento de testes, conta, submissões
│   ├── login/, register/, recover-password/   # Fluxos públicos de autenticação
│   ├── invite/[token]/    # Página pública de acesso via link de convite
│   ├── api/cron/          # Endpoint de manutenção agendada
│   ├── constants/, schemas/  # Constantes globais e schemas de validação (Zod)
│   └── routes.ts          # Mapa centralizado de rotas usado em navegação e redirecionamentos
├── models/                # Schemas do Mongoose, métodos estáticos/de instância, pipelines de agregação
├── lib/                   # Regras de negócio exclusivas do servidor (autenticação, CRUD de testes, e-mail, conexão com o banco)
├── helpers/                # Funções utilitárias puras, compartilhadas entre cliente e servidor
├── typings/                # Tipos TypeScript compartilhados
└── middleware.ts           # Propagação do token de autenticação + cabeçalhos de segurança
diagram/                    # Diagramas conceitual, entidade-relacionamento e de classes
```

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** `>=20.19`
- **[pnpm](https://pnpm.io/)** ou `npm`
- Uma instância do **MongoDB**: um cluster [Atlas](https://www.mongodb.com/atlas) ou um servidor local (`>= 6.0`)
- Uma **conta do Gmail com uma Senha de App**, usada para enviar e-mails de recuperação de senha

### Instalação
```bash
git clone https://github.com/Alphka/EduAlphka.git
cd EduAlphka
pnpm install
```

### Variáveis de Ambiente
Copie o arquivo de exemplo e preencha com seus próprios valores:
```bash
cp .env.example .env.local
```

| Variável | Obrigatória | Descrição |
| :--- | :---: | :--- |
| `MONGODB_URI` | Sim | String de conexão do MongoDB, ex.: `mongodb+srv://usuario:senha@cluster.mongodb.net/` |
| `DATABASE_NAME` | Não | Nome do banco de dados a ser usado; padrão é `development` ou `production`, conforme `NODE_ENV` |
| `HASH_SALT` | Sim | Salt secreto usado para gerar o hash HMAC-SHA512 das senhas. Utilize um valor longo e aleatório |
| `EMAIL` | Sim | Endereço do Gmail usado para enviar os códigos de recuperação de senha |
| `EMAIL_PASSWORD` | Sim | **Senha de App** do Gmail para a conta acima (não é a senha normal da conta) |

### Executando a Aplicação
* **Modo de desenvolvimento** (Turbopack, hot reload):
  ```bash
  pnpm dev
  ```
  Acesse [http://localhost:3000](http://localhost:3000).

* **Build e execução em produção:**
  ```bash
  pnpm build
  pnpm start
  ```

* **Rotina de limpeza agendada:** na Vercel, ela é executada automaticamente (veja `vercel.json`). Ao hospedar em outro ambiente, aponte um agendador externo (cron, um workflow do GitHub Actions, etc.) para `GET /api/cron` no intervalo desejado.

## Capturas de Tela

### Login e Registro

![Tela de login](.github/screenshots/login.png)

### Formulário de Criação de Teste

![Formulário de criação de teste](.github/screenshots/exam_creation.png)

### Painel do Professor

![Painel do Professor](.github/screenshots/professor_dashboard.png)

### Tela de Correção

![Tela de correção](.github/screenshots/dissertative_question_correction.png)

## Ideias para o Futuro
O plano de desenvolvimento original esboçou algumas direções além do que já está construído hoje. Nada disso está agendado ou prometido, são só possibilidades que podem valer a pena explorar mais adiante:

- Fazer sessões de teste de usabilidade com alunos e professores reais e ajustar a plataforma a partir do que eles encontrarem pela frente
- Adicionar testes de integração automatizados que cubram frontend e backend juntos
- Login social via Google, Microsoft, Facebook ou GitHub
- Autenticação de dois fatores
- Alguma forma de detecção de fraude em tempo real, como sinalizar logins simultâneos vindos de dispositivos diferentes
- Uma revisão de conformidade com a LGPD para como os dados pessoais e de avaliação são tratados
- Internacionalização, para a plataforma não ficar limitada ao português
- Sugestões assistidas por PLN para ajudar o professor a corrigir respostas dissertativas
- Recomendar material de estudo com base nas questões que os candidatos mais erram

## Contexto Acadêmico e Créditos
Este projeto foi concebido, projetado e desenvolvido como entrega final do **Projeto Integrador II** em:
- **Instituição:** Instituto Federal do Norte de Minas Gerais (IFNMG)
- **Campus:** Montes Claros, MG
- **Autor:** Kayo Felipe de Souza Melo
- **Período:** 2024–2025

O plano de desenvolvimento de software completo, cobrindo requisitos, diagramas de caso de uso, modelagem de banco de dados e estratégia de mercado/publicidade, está disponível sob consulta ou como PDF complementar no acervo acadêmico do projeto.

## Licença
Este projeto é distribuído sob os termos da [Licença ISC](LICENSE.md).
