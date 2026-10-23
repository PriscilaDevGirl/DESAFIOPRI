# language: pt
@ui
Funcionalidade: Controlar a barra de progresso
  Como usuário da página Progress Bar
  Quero interromper e retomar o progresso
  Para validar os limites e o reinício da barra

  Cenário: Parar antes de 25%, completar e reiniciar a barra
    Dado que estou na página inicial do DemoQA
    Quando interrompo a barra antes de 25%
    Então o valor interrompido é menor ou igual a 25%
    Quando retomo a barra até 100% e a reinicio
    Então a barra retorna a zero
