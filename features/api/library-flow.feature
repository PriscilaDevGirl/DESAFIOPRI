# language: pt
@api
Funcionalidade: Gerenciar uma conta e seus livros pela API
  Como consumidor da API Book Store
  Quero criar e autorizar uma conta
  Para associar livros e confirmar o estado final da conta

  Cenário: Criar uma conta, emprestar dois livros e consultar os detalhes
    Dado um usuário sintético com credenciais válidas
    Quando a conta é criada
    E um token de acesso é gerado
    Então a conta deve estar autorizada
    Quando dois livros disponíveis são associados à conta
    Então os detalhes da conta devem conter exatamente os dois livros escolhidos
