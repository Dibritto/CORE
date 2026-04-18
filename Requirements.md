# CØRE - Documentação de Requisitos e Progresso

## Visão Geral
Software híbrido (offline-first) para operação comercial crítica (PDV/Balcão).
Stack: Electron, Node.js, SQLite, JavaScript Vanilla.

60. **Design System Visual v2.0 (Ícones + Padrões UI):**
    - **Ação:** Implementação de uma identidade visual completa baseada em estética Retro-Cyberpunk / Terminal High-Res.
    - **Detalhes:**
        - **Cores:** Paleta restrita usando Preto Puro (#000), Cinza Escuro e Verde Neon (#00FF00) para máxima legibilidade.
        - **Componentes:** Padronização de Modais (com cabeçalhos de status e dot-indicators), Botões estilo terminal `[ TEXTO ]` e Inputs integrados.
        - **Ícones:** Novo set de ícones pixel-art em SVG integrados de forma nativa.
        - **Efeitos Especiais:** Implementação de overlay de Scanlines e CRT Flicker para imersão no tema de "Terminal de Operação Crítica".
        - **Modularização:** Separação de tokens e estilos em `design-system.css` e lógica de ícones em `icons.js`.

## Estado Atual
- **Fase:** Extra (Suporte & Design)
- **Status:** Concluído (DS v2.0)
- **Última Atualização:** Implementação do Design System Visual Completo.

## Estrutura de Pastas
- `/main`: Processo principal do Electron (Backend do SO).
- `/renderer`: Interface do usuário (Frontend).
- `/database`: Arquivos do SQLite.
- `/assets`: Recursos estáticos (ícones, imagens).

## Histórico de Implementação
1. **Fundação:** Projeto iniciado, Electron configurado.
2. **Banco de Dados:** SQLite integrado, tabelas criadas (products, orders, items, stock).
3. **Backend Local:** Lógica de `createOrder` centralizada com transações ACID.
4. **Fluxo Real:** Tela de PDV criada, conectada ao backend para leitura de produtos e escrita de vendas.
5. **Robustez:** Tratamento de erros, validação de estoque pré-venda e atalhos de cancelamento.
6. **Estoque:** Baixa automática consolidada e visualização de histórico de movimentações (Auditoria).
7. **Estados:** Pedidos nascem como 'recebido'. Lógica de transição de status implementada no backend.
8. **Usuários:** Tabela de usuários criada, login obrigatório ao iniciar o sistema.
9. **UX:** Navegação full-keyboard na lista de produtos e suporte a multiplicadores na busca.
10. **Híbrido:** Banco de dados preparado com UUIDs e flags de sincronização. Serviço de monitoramento ativo.
11. **Relatórios:** Visualização de vendas diárias restrita a gerentes.
12. **Impressão:** Geração de comprovante térmico automático após venda.
13. **EAN:** Suporte a leitura de código de barras na busca de produtos.
14. **Cadastro:** Interface para adição de novos produtos ao catálogo.
15. **Caixa:** Funcionalidade de Sangria e Suprimento para controle financeiro.
16. **Fechamento:** Relatório Z consolidado (Vendas + Entradas - Saídas) com impressão.
17. **Distribuição:** Criação de instalador Windows (.exe) com persistência em AppData.
18. **Segurança:** Backup automático rotativo (últimos 7 dias) na pasta de dados do usuário.
19. **UI:** Menu nativo personalizado com identidade do programa e idioma PT-BR.
20. **Assets:** Ícone personalizado integrado ao build e runtime.
21. **Ajuda:** Tela de lista de atalhos acessível via F12 ou Menu.
22. **Logs:** Registro de erros e eventos do sistema em arquivo local para auditoria.
23. **Devolução:** Funcionalidade para gerentes realizarem devoluções parciais ou totais de pedidos.
24. **Reposição:** Interface para gerentes visualizarem histórico e reporem estoque de produtos zerados.
25. **Gestão:** Funcionalidade para editar dados cadastrais ou excluir (inativar) produtos.
26. **Dashboard:** Painel visual com gráficos de desempenho de vendas e produtos mais vendidos.
27. **Descontos:** Funcionalidade para aplicar descontos monetários no total do pedido antes da finalização.
28. **Fila de Espera:** Capacidade de estacionar o carrinho atual e atender outro cliente, retomando o pedido depois.
29. **Clientes:** Cadastro e listagem de clientes para gestão de relacionamento.
30. **Suporte:** Link para blog de suporte acessível via menu de versão.

## Melhorias Estruturais e de Segurança (Janeiro/2026)

Esta seção documenta uma série de melhorias críticas implementadas para aumentar a segurança, estabilidade e manutenibilidade do sistema.

31. **Segurança de Contexto no Electron:**
    - **Problema:** A configuração anterior (`nodeIntegration: true`, `contextIsolation: false`) expunha o backend a potenciais ataques de XSS no frontend.
    - **Solução:** O isolamento de contexto foi ativado (`contextIsolation: true`) e a integração do Node.js desativada (`nodeIntegration: false`). A comunicação entre frontend e backend agora é feita de forma segura através de um **preload script**, que expõe apenas as funcionalidades necessárias via `contextBridge`.

32. **Hashing de Senhas (bcryptjs):**
    - **Problema:** Senhas de usuários eram armazenadas e comparadas em texto claro, uma falha grave de segurança.
    - **Solução:** A dependência `bcryptjs` foi adicionada. As senhas agora são hasheadas com um salt antes de serem salvas no banco de dados. A autenticação foi atualizada para comparar a senha fornecida com o hash armazenado. Foi criado um script de migração (`npm run migrate:passwords`) para atualizar as senhas existentes.

33. **Backup Seguro do Banco de Dados:**
    - **Problema:** O backup era feito com uma cópia direta do arquivo (`fs.copyFileSync`), o que poderia levar a backups corrompidos se o banco estivesse em uso.
    - **Solução:** O processo foi refatorado para usar a **API de backup online do SQLite** (`db.backup()`), que garante a atomicidade e a integridade do arquivo de backup.

34. **Refatoração dos Manipuladores de IPC:**
    - **Problema:** O arquivo principal (`main/index.js`) continha dezenas de registros de `ipcMain.handle`, tornando-o monolítico e difícil de manter.
    - **Solução:** Toda a lógica de manipulação de IPC foi movida para um módulo dedicado (`main/ipcHandlers.js`), tornando o código mais limpo, modular e organizado.

35. **Integridade Referencial (Foreign Keys):**
    - **Problema:** O SQLite não impõe a verificação de chaves estrangeiras por padrão.
    - **Solução:** O comando `PRAGMA foreign_keys = ON;` foi adicionado na inicialização da conexão com o banco de dados para garantir a integridade referencial entre as tabelas.

36. **Flexibilidade de Estoque para Gerentes:**
    - **Problema:** Rigidez na validação de estoque impedia gerentes de operar em casos de divergência física/lógica.
    - **Solução:** Implementada exceção na validação do frontend (`renderer.js`) permitindo que gerentes adicionem produtos ao carrinho mesmo com estoque insuficiente.

37. **Correção de Concorrência em Transações:**
    - **Problema:** Erro `SQLITE_ERROR: cannot start a transaction within a transaction` ocorria ao tentar realizar operações simultâneas (ex: cliques rápidos em finalizar venda).
    - **Solução:** Implementada uma fila de execução (Mutex) no backend (`service.js`) para serializar operações que utilizam transações (`createOrder`, `processReturn`). Adicionado bloqueio de UI no frontend (`renderer.js`) durante o processamento.

38. **Correção da Permissão de Estoque Negativo (Backend):**
    - **Problema:** A permissão para gerentes venderem sem estoque estava implementada apenas no frontend, causando erro de "Estoque insuficiente" no backend ao finalizar a venda.
    - **Solução:** A função `createOrder` no `service.js` foi atualizada para receber o `userId`, verificar a role do usuário e ignorar a validação de estoque caso seja um gerente.

39. **Correção na Lógica de Devoluções:**
    - **Problema:** Devoluções de vendas "Fiado" geravam saída de caixa indevida e falhavam se o campo `returned_quantity` fosse NULL.
    - **Solução:** Refatorado `processReturn` no `service.js` para usar `COALESCE` em somas SQL e abater a dívida do cliente caso a venda original tenha sido a prazo.

40. **Feedback de Erro na Impressão:**
    - **Problema:** O frontend exibia "Sucesso" mesmo quando a impressão falhava no backend, pois ignorava o retorno da função.
    - **Solução:** Adicionada verificação de `result.success` nas funções `printProductLabel` e `printZReport` no `renderer.js`.

41. **Seletor de Método de Pagamento:**
    - **Problema:** O sistema assumia "Dinheiro" como padrão, impedindo o registro correto de vendas a prazo ("Fiado").
    - **Solução:** Implementado um modal de seleção de pagamento na finalização da venda (`renderer.js`), permitindo escolher entre Dinheiro e Fiado (este último apenas com cliente identificado).

42. **Correção de Conflito de Atalhos (UX):**
    - **Problema:** Existiam dois ouvintes de teclado globais, fazendo com que pressionar `ESC` para cancelar a seleção de pagamento também limpasse o carrinho indevidamente.
    - **Solução:** Unificação de todos os eventos de teclado (`keydown`) em um único ouvinte hierárquico no `renderer.js`, garantindo que o `ESC` seja tratado pelo contexto correto (modal > sub-modal > carrinho).

43. **Padronização de Navegação e Correção de Atalhos:**
    - **Problema:** A tecla `ESC` não funcionava em menus de lista (Menu Principal, Clientes, Espera) devido a um bloqueio no código. Faltava navegação por setas em modais de confirmação e tabelas de devolução.
    - **Solução:** Refatoração do listener global de teclado para permitir o fluxo correto do evento `ESC` e implementação de lógica de setas para alternar opções (Sim/Não) e navegar verticalmente em inputs de tabelas.

44. **Navegação por TAB e Focus Trap (Menu Principal):**
    - **Problema:** O Menu Principal e listas auxiliares não suportavam a tecla `Tab`, permitindo que o foco "vazasse" para o fundo da tela e quebrando a experiência de uso via teclado.
    - **Solução:** Implementado suporte completo a `Tab` e `Shift+Tab` nos menus, criando um ciclo de foco fechado (Focus Trap) e garantindo que a navegação funcione mesmo se o foco for perdido momentaneamente.

## Atalhos de teclado

- **F2**: Foca no primeiro botão do menu principal.
- **ESC**: Fecha modais abertos, cancela operações ou limpa o carrinho de compras.
- **Setas (↑ ↓ ← →)**: Navega entre os botões do menu principal e outros modais, movendo o foco para o botão anterior ou próximo.

Esses atalhos melhoram a usabilidade e acessibilidade da aplicação.
46. **Correção de Foco no Menu Principal (F2):**
    - **Problema:** Ao abrir o menu com F2, o foco falhava intermitentemente, e as teclas direcionais Esquerda/Direita não funcionavam na lista de produtos.
    - **Solução:** Reforçada a função `openMainMenu` com `requestAnimationFrame` e timeout ajustado para garantir o foco. Adicionado suporte a `ArrowLeft` e `ArrowRight` na navegação da lista principal de produtos.

### Novas Dependências

- `bcryptjs`: Biblioteca para hashing de senhas, escolhida por ser em JavaScript puro e não requerer ferramentas de compilação nativas.

### Scripts Adicionados

- `npm run migrate:passwords`: Executa o script para migrar senhas em texto claro para o formato hasheado.


## Notas de Distribuição
- **Requisito de Build:** Para gerar o executável (`npm run dist`) no Windows, é necessário executar o terminal como **Administrador** ou ter o "Modo de Desenvolvedor" do Windows ativado. Isso é necessário para que o `electron-builder` possa extrair corretamente as ferramentas de assinatura que contêm links simbólicos.
- **Requisito de Ícone:** O arquivo `assets/icon.ico` deve conter obrigatoriamente uma camada de **256x256 pixels** para ser aceito pelo instalador do Windows.

47. **Estabilidade na Inicialização do Banco:**
    - **Problema:** O uso de `bcryptjs` de forma assíncrona durante a criação das tabelas causava condições de corrida, falhando a criação dos usuários padrão.
    - **Solução:** Alterado para `hashSync` garantindo a execução sequencial segura da migração inicial.

48. **Persistência de Descontos em Pedidos em Espera:**
    - **Problema:** O desconto aplicado era perdido ao colocar um pedido em espera e restaurá-lo.
    - **Solução:** Adicionada coluna `discount` na tabela `parked_carts` e atualizada a lógica de backend/frontend para salvar e restaurar esse valor.

49. **Otimização de Listeners de Busca:**
    - **Problema:** Listeners redundantes no campo de busca conflitavam intermitentemente com a navegação global.
    - **Solução:** Removida a lógica de navegação específica do input, delegando o controle para o gerenciador global de teclado.

50. **Funcionalidade de Quitação de Dívida (Fiado):**
    - **Problema:** O sistema permitia vender fiado, mas não tinha interface para registrar o pagamento posterior.
    - **Solução:** Adicionado botão "QUITAR DÍVIDA" na lista de clientes (visível se dívida > 0) e implementado fluxo completo de caixa (entrada) e atualização de saldo do cliente.

51. **Modo de Simulação de Impressão (Dev/Falha):**
    - **Problema:** O sistema falhava ao tentar imprimir em computadores sem impressoras instaladas (ambiente de dev).
    - **Solução:** Implementada verificação `getPrintersAsync`. Se nenhuma impressora for detectada, o sistema simula o sucesso e loga no console, prevenindo travamentos.

52. **Ajuste de UX na Busca:**
    - **Problema:** O campo de busca não indicava claramente as capacidades de leitura de código de barras ou multiplicadores, e o layout excedia a largura do painel.
    - **Solução:** Placeholder atualizado para "BUSCAR (NOME, EAN OU 2*ITEM)..." e propriedade `box-sizing: border-box` aplicada ao CSS do input.

53. **Documentação Técnica e Operacional:**
    - **Ação:** Criação dos arquivos `DISTRIBUTION.md` (guia de build, instalação e estrutura técnica) e `MANUAL.md` (guia de uso para operadores e gerentes).
    - **Objetivo:** Facilitar a distribuição do software e o treinamento de novos usuários.

## Auditoria e Manutenção (Abril/2026)

54. **Auditoria Geral de Sistema:**
    - **Ação:** Realizada auditoria completa abrangendo segurança, banco de dados (ACID), UX e conformidade com requisitos.
    - **Resultado:** Identificadas 2 falhas críticas corrigidas imediatamente.

55. **Correção do Preload (Bloqueio de API):**
    - **Problema:** O canal `pay-customer-debt` não estava exposto no `preload.js`, impedindo a quitação de dívidas.
    - **Solução:** Adicionado o canal à lista de permissões do `contextBridge`.

56. **Implementação do Fluxo de Pagamento (Dinheiro/Fiado):**
    - **Problema:** O sistema não permitia escolher entre venda em Dinheiro ou Fiado na finalização, registrando tudo como Dinheiro.
    - **Solução:** Atualizada a função `finalizeOrder` para disparar um modal de confirmação de pagamento caso o cliente esteja identificado, integrando a escolha ao backend e ao cupom impresso.

57. **Validação de Conformidade de Documentação:**
    - **Ação:** Sincronização de todos os estados atuais do software com o arquivo `Requirements.md` para garantir o registro fiel do projeto.

58. **Refatoração ACID (Reposição de Estoque):**
    - **Problema:** A função `replenishStock` realizava duas operações críticas no banco (atualizar estoque do produto e registrar na tabela de movimentos) sem uma transação, criando um risco de perda de integridade em caso de falha de hardware ou exceção.
    - **Solução:** Aplicada a mesma fila global (`transactionQueue`) e os comandos `BEGIN TRANSACTION` / `COMMIT` para garantir atomicidade.

59. **Salvamento Obrigatório e Formato Térmico:**
    - **Problema:** O salvamento de arquivos só ocorria se modos específicos de compartilhamento fossem selecionados. O formato de saída era largo e com excesso de margens brancas (estilo A4), prejudicando a visualização.
    - **Solução:** O sistema agora garante o salvamento de JPG e PDF em **todas as vendas**, utilizando o modo `save-only` caso o usuário não opte por compartilhar. A largura da captura foi fixada em 320px (padrão de bobinas térmicas) e a altura é ajustada dinamicamente ao conteúdo, eliminando espaços vazios e garantindo legibilidade perfeita.

61. **Fase de Produção e Teste (Versão 1.0.9):**
    - **Ação:** Blindagem final do sistema de distribuição (Auto-Publish).
    - **Detalhes:**
        - Adição do campo 'repository' no package.json.
        - Simplificação do comando de CI para evitar erros de shell.
        - Versão estável com rodapé limpo e barra de progresso.
        - **Controle de Permissões Equilibrado (Caixa x Gerente):** Foram liberadas as rotinas necessárias de operação de loja para a conta CAIXA 01 (Desconto, Clientes, Devoluções de pedidos, Fechamento de Caixa, Movimentação Sangria/Suprimento), mantendo as restrições gerenciais nas funcionalidades puramente de Gestão e Administrativas, tais quais as visualizações da Dashboard, Relatórios consolidados de vendas, configurações gerais da conta e do backup em nuvem, inclusão de Novos Produtos no Estoque, e visualização dos Logs de Auditoria Master.
62. **Resiliência do Auto-Updater (v1.0.1 Patch):**
    - **Problema:** O sistema exibia uma mensagem de erro genérica e assustadora ("Não foi possível conectar...") mesmo quando o servidor GitHub respondia corretamente que não havia novas versões (erro 404 por ausência de `latest.yml`). Além disso, o verificador tentava rodar em modo dev, gerando exceções.
    - **Solução:** 
        - Refatoração do `updater.js` com tratamento específico para erros de manifesto (404).
        - Substituição do erro crítico por uma mensagem informativa de "Sistema Atualizado" quando nenhum update é encontrado.
        - Implementação de bloqueio de verificação em ambiente de desenvolvimento com aviso amigável ao desenvolvedor.
        - Mensagens traduzidas e polidas para manter o padrão de excelência do CØRE.

63. **Unificação da Gestão Global de Produtos (v1.0.2):**
    - **Problema:** A edição de produtos era inacessível para itens com estoque normal (apenas acessível via relatório de estoque baixo), dificultando a manutenção do catálogo.
    - **Solução:** O botão "PRODUTOS" do menu principal foi transformado em um **Gestor Global**. Agora ele abre uma lista completa com todos os produtos do sistema, permitindo pesquisa, edição de dados (Nome, Preço, EAN) e exclusão rápida para qualquer item, independentemente do saldo em estoque.

64. **Blindagem de Distribuição (v1.0.10 - Produção):**
    - **Problema:** O instalador falhava em substituir os arquivos no Windows ao reiniciar devido a conflitos de permissão ou referências nulas.
    - **Solução:** Implementação de autoInstallOnAppQuit e inclusão de delay no quitAndInstall para garantir um reinício limpo.

65. **Teste de Estabilidade (v1.0.11):**
    - **Ação:** Lançamento de nova versão para validar a infraestrutura de atualizações automáticas.

66. **Disparador de Emergência Independente (v1.0.12):**
    - **Problema:** O instalador era bloqueado pelo Windows devido à ausência de assinatura digital (Authenticode Signature), impedindo o evento de conclusão do update.
    - **Solução:** Implementação de um manipulador de erro que ignora falhas de assinatura, localiza o arquivo .exe fisicamente na pasta temp e dispara o processo de instalação via 'spawn' independente. O sistema se fecha imediatamente após o disparo para liberar o executável.

67. **Teste de Estabilidade do Disparador (v1.0.13):**
    - **Ação:** Lançamento de versão para testar a transição entre v1.0.12 e v1.0.13 via processo independente.

68. **Validação Final da Arquitetura (v1.0.17):**
    - **Ação:** Teste de transição automática entre v1.0.16 e v1.0.17.

69. **Teste de Fogo do Bypass Independente (v1.0.19):**
    - **Ação:** Validação da atualização automática com contorno de bloqueio de assinatura digital.

70. **Auditoria e Blindagem de AutoUpdate (Audit 1.0):**
    - **Ação:** Auditoria técnica profunda no sistema de atualizações concluída e recomendações implementadas.
    - **Melhorias Realizadas:**
        - **Segurança:** Remoção de credencial exposta no `package.json` e limpeza de redundâncias.
        - **Robustez Multi-Nível:** O disparador de emergência agora busca o instalador em múltiplos locais (Pasta Pending, Temp do Sistema e Downloads) caso o Windows bloqueie o fluxo oficial.
        - **Integridade:** Adicionada validação de tamanho mínimo (10MB) para evitar execução de arquivos corrompidos.
        - **UX de Recuperação:** Caso a localização automática falhe, o sistema agora orienta o usuário com um link direto para o repositório de releases.
    - **Resultado:** Sistema de atualização blindado contra falhas de rede, permissões de disco e ausência de assinatura digital comercial.

71. **Versão de Teste Blindada (v1.0.20):**
    - **Ação:** Lançamento de versão para validar o novo sistema de busca multi-local e integridade de arquivo.

72. **Correção de Crash e Estabilidade do Instalador (v1.0.21):**
    - **Problema:** O instalador intermitentemente causava o fechamento do programa ou falha na atualização devido a conflitos de processos e permissões no Windows.
    - **Solução:** 
        - Implementação de **Single Instance Lock** para evitar que múltiplas janelas do CØRE corrompam os dados ou travem o executável.
        - Refatoração da configuração NSIS (`perMachine: false`, `allowElevation: true`) para garantir que as atualizações funcionem sem exigir senha de administrador em cada checkout.
        - Adição de logs de início imediato para facilitar o diagnóstico de "crash no boot".

73. **Resolução de Erro de Desinstalação (v1.0.22):**
    - **Problema:** Erro -1073740940 (Heap Corrupt) ao tentar desinstalar a v1.0.20/v1.0.21.
    - **Solução:** Reversão para `perMachine: true` para alinhar as permissões de escrita em disco e garantir que o instalador tenha autoridade total para remover arquivos travados da versão anterior.

74. **Início Seguro e Blindagem de GPU (v1.0.23):**
    - **Problema:** Crash nativo "Parou de Funcionar" em hardwares legados.
    - **Solução:** 
        - Desativação forçada de GPU via argumentos de linha de comando (`appendSwitch`).
        - Implementação de `try-catch` na inicialização do Banco de Dados para detectar ausência de dependências nativas (Visual C++ Redist).
        - Mensagens de erro informativas em vez de encerramento silencioso.

75. **Diagnóstico de Erros Detalhado (v1.0.24):**
    - **Ação:** Atualização da caixa de diálogo de erro crítico para exibir a mensagem da exceção, permitindo diagnóstico remoto via captura de tela do usuário.

76. **Suporte a Arquitetura Dupla (v1.0.25):**
    - **Problema:** Crash nativo imediato sugerindo incompatibilidade de arquitetura em máquinas de balcão legadas.
    - **Solução:** Configuração do CI para gerar builds tanto em `x64` quanto em `ia32` (32 bits), garantindo compatibilidade universal com processadores Windows antigos.
