# language: pt
@ui
Funcionalidade: Validar conteúdo em uma nova janela
  Como visitante do DemoQA
  Quero abrir a janela de exemplo
  Para confirmar que a mensagem exibida está correta

  Cenário: Abrir uma nova janela, validar a mensagem e fechá-la
    Dado que estou na página inicial do DemoQA
    Quando abro Browser Windows e solicito uma nova janela
    Então a nova janela exibe a mensagem de exemplo e é fechada
