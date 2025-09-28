# e-Move Frontend

O **e-Move** é uma plataforma completa de planejamento de rotas inteligente para motoristas de veículos elétricos. Este repositório contém o código-fonte do **frontend**, desenvolvido com Next.js, oferecendo uma experiência moderna e responsiva para gerenciar sua jornada elétrica.

A aplicação frontend consome os dados da nossa [API de backend (e-Move Backend)](https://github.com/FeCocco/e-move-backend), que é responsável por toda a lógica de negócios, gerenciamento de usuários e integração com serviços externos.

---

## Funcionalidades Principais

### Sistema de Autenticação
- **Login e Cadastro Seguros:** Sistema completo com validação de dados
- **Autenticação baseada em Cookies HttpOnly** para máxima segurança
- **Validação em tempo real** com feedback visual durante o preenchimento
- **Medidor de força de senha** para garantir segurança das contas

### Dashboard Interativo
- **Painel de Controle Completo:** Interface intuitiva com navegação por abas
- **Gerenciamento de Perfil:** Edite suas informações pessoais facilmente
- **Animações Suaves:** Transições fluidas entre seções com Framer Motion
- **Design Responsivo:** Funciona perfeitamente em desktop, tablet e mobile

### Gerenciamento de Veículos
- **Garagem Virtual:** Cadastre múltiplos veículos elétricos
- **Base de Dados Abrangente:** Catálogo com diversos modelos de VEs
- **Controle de Bateria:** Monitore e atualize o nível de carga
- **Cálculo de Autonomia:** Estimativa automática baseada no nível da bateria
- **Busca Inteligente:** Encontre rapidamente o veículo desejado

### Planejamento de Rotas (Ainda em desenvolvimento)
- **Cálculo Inteligente:** Considera autonomia do veículo para sugerir paradas
- **Integração com MapLibre:** Visualização rica em mapas interativos
- **Roteamento OSRM:** Otimização de rotas com dados em tempo real
- **Gestão de Rotas Salvas:** Organize suas viagens favoritas

### Estações de Recarga (Ainda em desenvolvimento)
- **Base Unificada:** Consulta em tempo real via OpenChargeMap API
- **Estações Favoritas:** Salve seus pontos de recarga preferidos
- **Informações Detalhadas:** Dados completos sobre disponibilidade e tipos de conectores

### Relatórios e Analytics (Somente cosmético)
- **Dashboard de Métricas:** Visualize estatísticas de uso dos seus veículos
- **Gráficos Interativos:** Charts.js e Recharts para visualização de dados
- **Análise de Satisfação:** Métricas de experiência do usuário
- **Estatísticas de Consumo:** Acompanhe distância, energia e economia de CO₂

---

## Tecnologias Utilizadas

### Frontend Framework
- **[Next.js](https://nextjs.org/)** - Framework React para produção
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento eficiente de formulários
- **[Zod](https://zod.dev/)** - Validação de schema TypeScript-first

### Interface & Design
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos e acessíveis
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animações avançadas
- **[Lucide React](https://lucide.dev/)** - Ícones SVG otimizados

### Visualização de Dados
- **[Chart.js](https://www.chartjs.org/)** - Gráficos interativos
- **[Recharts](https://recharts.org/)** - Componentes de gráfico para React

### Ferramentas de Desenvolvimento
- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes rápido e eficiente
- **[Sonner](https://sonner.emilkowal.ski/)** - Sistema de notificações toast elegante

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **[Node.js](https://nodejs.org/en/)** - Versão 18.x ou superior
2. **[pnpm](https://pnpm.io/installation)** - Para instalar:
   ```bash
   npm install -g pnpm
   ```

---

## Configuração do Ambiente Local

### 1. Clone o repositório
```bash
git clone https://github.com/FeCocco/e-move-frontend.git
cd e-move-frontend
```

### 2. Instale as dependências
```bash
pnpm install
```


### 3. Inicie o servidor de desenvolvimento
```bash
pnpm dev
```

### 4. Acesse a aplicação
Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

> **⚠️ Importante:** Para funcionalidade completa (autenticação, dados de veículos, etc.), o **servidor backend** deve estar rodando simultaneamente. Consulte o README do [e-Move Backend](https://github.com/FeCocco/e-Move/tree/main/e-move-backend).

---

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia o servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Inicia o servidor de produção
pnpm lint         # Executa o linter
```

---

## Estrutura do Projeto

```
src/
├── app/                   # App Router do Next.js
│   ├── cadastro/          # Página de cadastro
│   ├── dashboard/         # Painel principal
│   ├── login/             # Página de login
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── AbasDashboard/     # Componentes das abas do dashboard
│   ├── AppCard/           # Cards personalizados
│   ├── Charts/            # Gráficos e visualizações
│   ├── DashboardNav/      # Navegação do dashboard
│   ├── TelaInicial/       # Landing page
│   └── ui/                # Componentes base (shadcn/ui)
├── hooks/                 # Custom hooks React
├── lib/                   # Utilitários e configurações
└── utils/                 # Funções auxiliares
```

---

## Funcionalidades Visuais

### Design System
- **Paleta de Cores:** Gradientes cyan/azul para elementos elétricos
- **Tipografia:** Combinação Orbitron (títulos) + Poppins (textos)
- **Animações:** Micro-interações suaves e feedback visual
- **Dark Theme:** Interface otimizada para uso em ambientes variados

### Componentes Destacados
- **Cards 3D Interativos:** Efeitos de hover com perspectiva
- **Navegação Fluida:** Indicador animado de aba ativa
- **Formulários Inteligentes:** Validação em tempo real com feedback visual
- **Gráficos Responsivos:** Visualizações que se adaptam ao tamanho da tela

---

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## Equipe de Desenvolvimento

- **Felipe Giacomini Cocco** - *RA 116525*
- **Fernando Gabriel Perinotto** - *RA 115575*
- **Jhonatas Kévin de Oliveira Braga** - *RA 116707*
- **Lucas Santos Souza** - *RA 116852*
- **Samuel Wilson Rufino** - *RA 117792*

---

## Suporte

Encontrou um bug ou tem uma sugestão? Entre em contato:

- **Email:** [emovesuporte@gmail.com](mailto:emovesuporte@gmail.com)
- **Issues:** Abra uma issue neste repositório

---

## Licença

Este projeto ainda está definindo sua licença. Mais informações em breve.

---

## Roadmap

- [x] **Conceito e Pesquisa** - Validação da ideia
- [x] **Desenvolvimento MVP** - Em andamento
- [ ] **Lançamento Beta** - Próximos passos
- [ ] **Expansão Nacional** - Futuro

---

<div align="center">

*Construído com ⚡ pela equipe e-Move*

</div>
