# Accenture QA Automation

Automação independente do DemoQA com JavaScript, Selenium WebDriver e Cucumber. Os cenários BDD estão em português e verificam contratos da API e comportamentos observáveis da interface.

## Pré-requisitos

- Node.js 20 ou superior.
- Google Chrome instalado. O Selenium Manager resolve o ChromeDriver quando necessário.
- Acesso de rede a `https://demoqa.com`.

## Instalação e execução no PowerShell

Execute a partir da pasta do projeto:

```powershell
npm.cmd ci
npm.cmd run test:api
npm.cmd run test:ui
npm.cmd run test:bonus
```

`npm.cmd test` executa todas as suítes, inclusive o bônus. Os comandos foram escritos com `npm.cmd` para funcionar mesmo quando a política do PowerShell bloqueia `npm.ps1`.

Para abrir o Chrome em modo visível:

```powershell
$env:HEADLESS = 'false'
npm.cmd run test:ui
Remove-Item Env:HEADLESS
```

As URLs podem ser configuradas para ambientes compatíveis:

```powershell
$env:BASE_URL = 'https://demoqa.com'
$env:API_BASE_URL = 'https://demoqa.com'
npm.cmd test
Remove-Item Env:BASE_URL
Remove-Item Env:API_BASE_URL
```

Nenhuma credencial real é necessária. O cenário de API gera usuário e senha sintéticos em memória; depois da verificação, o hook tenta remover a conta. Uma falha de limpeza também falha o cenário, em vez de ser ignorada.

## Suítes e evidências

- `npm.cmd run test:api`: fluxo de conta, token, autorização, catálogo, empréstimo de dois livros, consulta final e limpeza.
- `npm.cmd run test:ui`: formulário, nova janela, CRUD de uma linha, barra de progresso e Sortable.
- `npm.cmd run test:bonus`: criação dinâmica e limpeza das 12 linhas.
- `npm.cmd test`: execução completa.

Cada comando gera um JSON Cucumber independente em `reports\`. Em caso de falha, o hook anexa uma captura de tela ao relatório. Os relatórios são ignorados pelo Git para evitar publicar evidências de execuções locais acidentalmente; o workflow de CI publica os arquivos como artefato da execução.

## Coleção Postman

Importe [postman/demoqa-api.collection.json](./postman/demoqa-api.collection.json) e execute a coleção na ordem apresentada pelo Collection Runner. Ela cria credenciais sintéticas durante a execução, escolhe dois livros retornados pelo catálogo, valida o usuário e termina removendo a conta. A coleção limpa suas variáveis após a exclusão bem-sucedida; não salve nem publique o estado de runtime da coleção.

## Decisões e limitações conhecidas

Consulte [DECISIONS.md](./DECISIONS.md) para os comportamentos da versão do DemoQA que foram observados e as alternativas usadas sem enfraquecer as asserções. Em particular:

- O botão `Close` do modal do formulário não fecha o popup nesta versão do site; `Escape` fecha e é a interação automatizada.
- Na tabela, excluir um registro criado remove todas as linhas criadas na sessão, mantendo as linhas iniciais. O bônus confirma que nenhuma das 12 linhas permanece, mas não pode demonstrar 12 exclusões individuais nesse site.
- A API pública e a UI do DemoQA são compartilhadas e externas. Indisponibilidade ou mudança de comportamento pode interromper CI; o teste não substitui um ambiente controlado.

## Checklist e autoavaliação

- Requisitos e cobertura: [CHECKLIST.md](./CHECKLIST.md).
- Arquitetura mantida pequena: cliente HTTP único, Page Object por tela e steps Cucumber por comportamento; mais estrutura só foi introduzida para interações compartilhadas e falhas observadas.
- Risco remanescente: dependência de um site público e de dois defeitos funcionais constatados. Se o projeto crescer, o próximo passo seria separar ambientes de teste controlados, introduzir uma fábrica de dados compartilhada apenas quando houver mais fluxos e publicar relatórios com retenção/redação definida.

O workflow está em `.github/workflows/qa.yml`. Ele está preparado para CI, mas nenhum repositório remoto foi configurado e nada foi publicado no GitHub.
