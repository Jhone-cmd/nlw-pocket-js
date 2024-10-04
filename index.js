function start() {
  while (true) {
    const opcao = "sair";
    switch (opcao) {
      case "cadastrar":
        console.log("cadastro de metas");
        break;
      case "listar":
        console.log("listagem de metas");
        break;
      case "sair":
        console.log("Saindo do sistema. Até a próxima! 👋");
        return;
    }
  }
}

start();
