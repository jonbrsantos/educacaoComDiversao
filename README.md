# 🕹️ Plataforma de Jogos Educativos

Esta é uma aplicação web desenvolvida com **Flask** que oferece uma **plataforma de jogos educativos** desenvolvidos em **JavaScript**. A plataforma conta com sistema de login, gerenciamento de usuários (CRUD) e área exclusiva para administradores.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3**
- **Flask** — Framework web leve e poderoso
- **Flask-SQLAlchemy** — ORM para banco de dados relacional
- **SQLite** — Banco de dados local utilizado para persistência

### Frontend
- **HTML5 / CSS3**
- **JavaScript** — Usado para criar jogos interativos

### Outros
- **Jinja2** — Engine de templates utilizada pelo Flask
- **JSON** — Para inserção inicial de usuários com `seedUsuarios.json`

---

## 📁 Estrutura do Projeto

```
/seu_projeto/
│
├── app.py                  # Arquivo principal da aplicação Flask
├── models.py               # Modelos de dados e função de seed
├── config.py               # Configurações Flask
├── seedUsuarios.json       # Dados de usuários iniciais
│
├── /templates/             # Templates HTML renderizados pelo Flask
│   ├── login.html
│   ├── administrador.html
│   ├── cadastrar_usuario.html
│   ├── editar_usuario.html
│   └── select_game.html
│
├── /static/                # Arquivos estáticos como JS e CSS
│   └── /js/
│       ├── alfabeto.js
│       ├── memoria.js
│       ├── rimas.js
│       └── ...
```

---

## 🔐 Funcionalidades

- Autenticação de usuários com controle de sessão
- Área administrativa com:
  - Listagem de usuários
  - Cadastro, edição e exclusão de usuários
- Acesso a jogos para alunos
- Interface intuitiva para seleção de atividades

---
## 🗄️ Estrutura do banco de dados
| Coluna  | Tipo de Dado   | Restrições                     | Descrição                             |
| ------- | -------------- | ------------------------------ | ------------------------------------- |
| `id`    | `INTEGER`      | `PRIMARY KEY`, `AUTOINCREMENT` | Identificador único do usuário        |
| `nome`  | `VARCHAR(100)` | `NOT NULL`                     | Nome completo do usuário              |
| `email` | `VARCHAR(120)` | `NOT NULL`, `UNIQUE`           | Email (login)                         |
| `senha` | `VARCHAR(100)` | `NOT NULL`                     | Senha (armazenada em texto)           |
| `tipo`  | `VARCHAR(20)`  | `NOT NULL`                     | Tipo de usuário: `admin` ou `usuario` |


## 👤 Tipos de Usuários

- **Admin:** Pode acessar o painel de administração e gerenciar usuários
- **Usuário comum (aluno):** Acessa diretamente os jogos após login

---

## ▶️ Como Executar o Projeto

1. **Clone o repositório**
```bash
git clone https://github.com/jonbrsantos/educacaoComDiversao.git
cd educacaoComDiversao
```

2. **(Opcional) Crie e ative um ambiente virtual**
```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Execute o servidor Flask**
```bash
python app.py
```

5. **Acesse no navegador**:  
[http://localhost:5000](http://localhost:5000)

---

## ✅ Usuário Admin de Exemplo (seed)

```json
[
  {
    "nome": "Administrador",
    "email": "admin@exemplo.com",
    "senha": "1234",
    "tipo": "admin"
  }
]
```

Esse usuário será criado automaticamente se não existir no banco de dados.

---

## 📌 Observações

- O banco de dados SQLite é criado automaticamente na primeira execução.
- Os jogos são arquivos HTML com lógica em JavaScript.
- A senha dos usuários é armazenada em texto puro (somente para fins educacionais).

---

## 📄 Licença

Este projeto é de uso educacional e pode ser modificado livremente para fins de aprendizado.

---

Desenvolvido com ❤️ usando Python + Flask.
