# language: pt
@ui
Funcionalidade: Manter registros na tabela web
  Como usuário da página Web Tables
  Quero criar, editar e excluir um registro
  Para conferir que as alterações são refletidas na tabela

  Cenário: Criar, editar e remover um registro próprio
    Dado que estou na página inicial do DemoQA
    Quando crio e edito um registro único em Web Tables
    Então os valores atualizados aparecem na tabela
    Quando excluo o registro criado
    Então o registro não aparece mais na tabela

  @bonus
  Cenário: Criar dinamicamente doze registros e remover todos
    Dado que estou na página inicial do DemoQA
    Quando crio doze registros dinâmicos em Web Tables
    Então os doze registros criados estão visíveis
    Quando excluo todos os registros criados
    Então nenhum registro do teste permanece na tabela
