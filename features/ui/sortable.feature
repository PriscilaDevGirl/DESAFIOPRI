# language: pt
@ui
Funcionalidade: Ordenar elementos por arraste
  Como usuário da página Sortable
  Quero organizar os elementos em ordem crescente
  Para confirmar a sequência apresentada

  Cenário: Ordenar os elementos da lista em ordem crescente
    Dado que estou na página inicial do DemoQA
    Quando organizo os elementos da lista por arraste
    Então a lista aparece na ordem crescente esperada
