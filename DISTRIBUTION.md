# CØRE - Guia de Distribuição e Manutenção Técnica

## 1. Visão Geral
O **CØRE** é um sistema de PDV (Ponto de Venda) desenvolvido em Electron + Node.js + SQLite. Ele opera em arquitetura *offline-first*, garantindo funcionamento mesmo sem internet, com sincronização em segundo plano (quando disponível).

## 2. Requisitos de Ambiente (Desenvolvimento)
Para compilar ou modificar o sistema, o ambiente deve possuir:
- **Node.js:** Versão 16 ou superior (Recomendado: LTS).
- **Git:** Para controle de versão.
- **Windows Build Tools:** Necessário para compilar dependências nativas do SQLite e bcrypt no Windows.

## 3. Instalação e Configuração Inicial

1. **Clonar o Repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd CORE
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configuração do Banco de Dados:**
   O sistema cria automaticamente o arquivo `database.sqlite` na primeira execução.
   Para migrar senhas antigas (texto plano) para hash seguro:
   ```bash
   npm run migrate:passwords
   ```

## 4. Compilação e Distribuição (Build)

O sistema utiliza `electron-builder` para gerar o executável (`.exe`) e o instalador.

### Comando de Build
```bash
npm run dist
```

> **ATENÇÃO:** No Windows, execute o terminal (PowerShell ou CMD) como **Administrador**. Isso é necessário para que o processo de build possa criar links simbólicos durante o empacotamento.

### Artefatos de Atualização (Auto-Update)
Para que o sistema de atualização automática funcione, é obrigatório realizar o upload dos seguintes arquivos para o GitHub Releases:
- `CORE Setup 1.0.0.exe` (ou versão atual)
- `latest.yml`: Este arquivo é gerado pelo `electron-builder` e contém as informações de hash e versão necessárias para o `electron-updater` validar se há um novo download. Sem ele, o sistema reportará que não há atualizações disponíveis.

## 5. Estrutura de Arquivos e Logs

### Localização dos Dados (Usuário Final)
Após instalado, o sistema armazena seus dados na pasta `AppData` do usuário:
- **Caminho:** `%APPDATA%\CORE\` (Ex: `C:\Users\Nome\AppData\Roaming\CORE\`)
- **Arquivos Críticos:**
  - `database.sqlite`: O banco de dados de produção.
  - `core.log`: Arquivo de log para auditoria de erros e eventos.
  - `backups/`: Pasta contendo cópias de segurança rotativas do banco de dados.

### Logs de Erro
Caso o sistema apresente falhas, solicite ao usuário o arquivo `core.log`.
- **Erros Críticos:** Iniciam com `[ERROR] CRASH FATAL`.
- **Erros de Impressão:** Geralmente relacionados a drivers ou fila de impressão do Windows.

## 6. Segurança

- **Senhas:** Armazenadas com hash (bcrypt). Nunca altere senhas diretamente no banco SQLite sem gerar o hash correspondente.
- **Backup:** O sistema realiza backup automático a cada inicialização.
- **Context Isolation:** O Frontend não tem acesso direto ao Node.js. Toda comunicação passa pelo `preload.js` (API segura).

## 7. Scripts Disponíveis (`package.json`)

- `npm start`: Inicia o sistema em modo de desenvolvimento.
- `npm run dist`: Gera o instalador para distribuição.
- `npm run migrate:passwords`: Executa script de segurança nas senhas.

---
**Suporte Técnico:**
Para dúvidas avançadas, consulte a documentação interna do código ou o blog de suporte linkado no menu "Sobre".