# Checklist de requisitos

| Requisito | Implementação | Validação / observação |
|---|---|---|
| JavaScript, Selenium WebDriver e Cucumber | `package.json`, configuração e steps/features | Executado localmente com Node.js 24 e Chrome 155 |
| Cliente de API | `src/api/demoqa-client.js` | Fluxo completo `@api` passou |
| Criar conta e gerar token | `features/api/library-flow.feature` | IDs e token verificados; credenciais sintéticas em memória |
| Confirmar autorização | Step de autorização da API | Resposta booleana `true` verificada |
| Listar catálogo e emprestar dois livros | API step escolhe dois ISBNs distintos da resposta | HTTP 201 para associação |
| Consultar dados finais do usuário | API step compara exatamente dois ISBNs e ID da conta | HTTP 200 e conteúdo verificados |
| Limpar conta criada pela API | Hook `After @api` | DELETE executado após o cenário; falha de cleanup falha o cenário |
| Formulário completo e arquivo `.txt` | `features/ui/practice-form.feature`, Page Object e `test-data/student-document.txt` | Campos e valores da confirmação verificados; modal removido com `Escape` |
| Nova janela e mensagem | `features/ui/browser-windows.feature` | Novo handle, texto esperado e fechamento verificados |
| Criar, editar e excluir registro | `features/ui/web-tables.feature` | Campos da linha atualizada comparados; linha removida verificada |
| Bônus: 12 registros dinâmicos e limpeza | Cenário `@bonus` em Web Tables | As 12 linhas são verificadas; todas ausentes após limpeza. Limitação da exclusão em lote registrada em `DECISIONS.md` |
| Barra de progresso | `features/ui/progress-bar.feature` | Parada `≤25%`, progresso `100%` e reset para `0%` |
| Ordenação crescente por drag-and-drop | `features/ui/sortable.feature` | Ordem completa `One` a `Six` verificada após arraste; a leitura aguarda os seis itens visíveis para evitar observar a renderização transitória |
| Cenários independentes e dados exclusivos | Cada cenário UI cria seu próprio WebDriver; API gera usuário único | Execuções direcionadas por tag/nome disponíveis |
| Seletores e esperas observáveis | Page Objects usam IDs, texto/roles e `WebDriverWait` | Nenhuma espera fixa de sincronização no código final |
| Credenciais fora do código e relatórios | API gera credenciais sintéticas em runtime; Postman limpa variáveis após DELETE | Nenhuma credencial real é configurada ou reportada |
| README, coleção Postman e relatório Cucumber | README, coleção v2.1, JSON Cucumber por suíte e capturas em falhas | Artefatos locais e workflow configurados |
| Workflow de CI | `.github/workflows/qa.yml` | Configurado; execução em GitHub Actions ainda não realizada |
| Versionar/publicar no GitHub | Não executado | Não há repositório remoto; publicação depende de autorização explícita |

## Resultado da validação final

- `npm.cmd run test:api`: 1 cenário e 7 passos aprovados.
- `npm.cmd run test:ui`: 5 cenários e 30 passos aprovados.
- `npm.cmd run test:bonus`: 1 cenário e 7 passos aprovados.
- `npm.cmd test`: 7 cenários e 44 passos aprovados.
- Os relatórios JSON gerados (`api.json`, `ui.json`, `bonus.json` e `cucumber.json`) foram lidos e validados localmente.
