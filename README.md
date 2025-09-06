# e-Move Backend

API RESTful desenvolvida em Spring Boot para a plataforma **e-Move**, um planejador de rotas inteligente para veículos elétricos.

Este backend é responsável por gerenciar toda a lógica de negócios, incluindo autenticação de usuários, gerenciamento de veículos e rotas, e servir como um proxy seguro para APIs externas de mapeamento e estações de recarga. A API é consumida pelo nosso [frontend (e-Move Frontend)](https://github.com/FeCocco/e-move-frontend).

---

## Funcionalidades da API

* **Endpoints de Autenticação:** Rotas seguras para cadastro, login (`/api/login`) e logout (`/api/logout`) de usuários.
* **Autenticação com JWT:** Geração de tokens JWT e gerenciamento de sessão através de Cookies `HttpOnly` para maior segurança.
* **Endpoint de Perfil:** Rota protegida (`/api/usuario/me`) para buscar dados do usuário autenticado.
* **Validação de Dados:** Validação no lado do servidor para garantir a integridade dos dados recebidos do cliente.
* **CRUDs Futuros:** Arquitetura preparada para receber os endpoints de gerenciamento de Veículos e Rotas.

---

## Tecnologias Utilizadas

* **Framework:** [Spring Boot 3](https://spring.io/projects/spring-boot)
* **Linguagem:** [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
* **Banco de Dados:** [MariaDB](https://mariadb.org/) (compatível com MySQL)
* **Acesso a Dados:** [Spring Data JPA](https://spring.io/projects/spring-data-jpa) / [Hibernate](https://hibernate.org/)
* **Segurança:** [Spring Security](https://spring.io/projects/spring-security) (para PasswordEncoder) e [jjwt](https://github.com/jwtk/jjwt) para tokens.
* **Build Tool:** [Maven](https://maven.apache.org/)

---

## Pré-requisitos

Antes de começar, você precisa ter as seguintes ferramentas instaladas em sua máquina:

1.  **[Java Development Kit (JDK)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)**: Versão 17.
2.  **[Maven](https://maven.apache.org/download.cgi)**: Gerenciador de dependências e build para projetos Java. (Embora o projeto use o Maven Wrapper, ter o Maven instalado globalmente é uma boa prática).
3.  **[MariaDB](https://mariadb.org/download/)**: Um sistema de gerenciamento de banco de dados relacional (ou qualquer banco compatível com MySQL, como o próprio MySQL Server).

---

## Configuração do Ambiente Local

Siga os passos abaixo para rodar o projeto na sua máquina.

**1. Clone o repositório:**
```bash
git clone https://github.com/FeCocco/e-move-backend.git
cd e-move-backend
```

**2. Configure o Banco de Dados:**
Conecte-se ao seu servidor MariaDB/MySQL e execute os seguintes comandos para criar o banco de dados e o usuário da aplicação:

```sql
CREATE DATABASE EMOVE;

CREATE USER 'User_emove'@'localhost' IDENTIFIED BY '[COLOQUE_SUA_SENHA_AQUI]';
GRANT ALL PRIVILEGES ON EMOVE.* TO 'User_emove'@'localhost';
FLUSH PRIVILEGES;
```
> **Atenção:** Substitua `[COLOQUE_SUA_SENHA_AQUI]` por uma senha forte e segura de sua escolha.

**3. Configure as Variáveis de Ambiente:**
Na pasta `src/main/resources/`, renomeie o arquivo `application-dev.properties.template` para `application-dev.properties`. Em seguida, edite o arquivo e preencha com os dados do seu banco:

```properties
# ...
spring.datasource.username=User_emove
spring.datasource.password=[A_MESMA_SENHA_QUE_VOCÊ_DEFINIU_NO_PASSO_2]
# ...
```

**4. Compile e instale as dependências:**
Use o Maven Wrapper incluído no projeto para compilar e baixar todas as dependências.

*No Linux/macOS:*
```bash
./mvnw clean install
```

*No Windows:*
```bash
mvnw clean install
```
> Se você receber um erro de "Permissão negada" no Linux/macOS, execute `chmod +x mvnw` primeiro.

**5. Inicie o servidor:**
Você pode iniciar a aplicação através da sua IDE (IntelliJ, VS Code, etc.) ou pelo terminal com o comando:

*No Linux/macOS:*
```bash
./mvnw spring-boot:run
```

*No Windows:*
```bash
mvnw spring-boot:run
```

A API estará rodando em [http://localhost:8080](http://localhost:8080).

> **Nota:** Para uma experiência completa, o **servidor frontend** deve estar rodando simultaneamente. Consulte o README do [e-Move Frontend](https://github.com/FeCocco/e-Move/tree/main/e-move-frontend) para as instruções.