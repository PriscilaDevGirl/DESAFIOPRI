# language: pt
@ui
Funcionalidade: Enviar o formulário de prática
  Como visitante do DemoQA
  Quero enviar um formulário completo
  Para confirmar que os dados foram recebidos

  Cenário: Enviar os dados do estudante e fechar a confirmação
    Dado dados sintéticos completos para o formulário de prática
    Quando envio o formulário Practice Form
    Então a confirmação deve mostrar os dados enviados
    E a confirmação é fechada
