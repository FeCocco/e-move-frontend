# e-Move Frontend

O **e-Move** é uma plataforma de planejamento de rotas inteligente para motoristas de veículos elétricos. Este repositório contém o código-fonte do **frontend**, desenvolvido com Next.js e Tailwind CSS.

A aplicação frontend consome os dados da nossa [API de backend (e-Move Backend)](https://github.com/FeCocco/e-move-backend), que é responsável por toda a lógica de negócios, gerenciamento de usuários e integração com serviços externos.

---

## Funcionalidades Principais

* **Autenticação Segura:** Sistema de Login e Cadastro com validação de dados e autenticação baseada em Cookies `HttpOnly`.
* **Dashboard Interativo:** Painel de controle para o usuário gerenciar suas informações, veículos e rotas.
* **Planejamento de Rota Inteligente:** Ferramenta para calcular rotas, considerando a autonomia do veículo e sugerindo paradas para recarga.
* **Visualização de Mapa:** Integração com APIs de mapa (MapLibre) e roteamento (OSRM) para uma experiência visual rica.
* **Busca de Estações:** Consulta em tempo real de estações de recarga através da API OpenChargeMap.
* **Interface Responsiva:** Design que se adapta a desktops, tablets e celulares.

---

## Tecnologias Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
* **Animações:** [Framer Motion](https://www.framer.com/motion/)
* **Gerenciamento de Formulários:** [React Hook Form](https://react-hook-form.com/)
* **Validação de Schema:** [Zod](https://zod.dev/)
* **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/)

---

## Pré-requisitos

Antes de começar, você precisa ter as seguintes ferramentas instaladas em sua máquina:

1.  **[Node.js](https://nodejs.org/en/)**: Versão 18.x ou superior. Essencial para o ambiente JavaScript.
2.  **[pnpm](https://pnpm.io/installation)**: Um gerenciador de pacotes rápido e eficiente. Para instalar, após ter o Node.js, rode no seu terminal:
    ```bash
    npm install -g pnpm
    ```

---

## Configuração do Ambiente Local

Siga os passos abaixo para rodar o projeto na sua máquina.

**1. Clone o repositório:**
```bash
git clone [https://github.com/FeCocco/e-Move.git](https://github.com/FeCocco/e-Move.git)
cd e-Move/e-move-frontend
```

**2. Instale as dependências:**
Use o `pnpm` para instalar todos os pacotes necessários definidos no `package.json`.
```bash
pnpm install
```

**3. Inicie o servidor de desenvolvimento:**
Este comando irá iniciar a aplicação em modo de desenvolvimento, geralmente na porta `3000`.
```bash
pnpm dev
```

**4. Acesse a aplicação:**
Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000).

> **Nota:** Para que a aplicação funcione completamente (login, cadastro, etc.), o **servidor backend** precisa estar rodando simultaneamente. Consulte o README do [e-Move Backend](https://github.com/FeCocco/e-Move/tree/main/e-move-backend) para as instruções de setup.
