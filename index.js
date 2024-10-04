// const {} = require("@inquirer/prompts"); CommonJs

import { select } from "@inquirer/prompts"; // EsModule

async function start() {
  while (true) {
    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar Meta",
          value: "cadastrar",
        },
        {
          name: "Listar Metas",
          value: "Listar",
        },
        {
          name: "sair",
          value: "Sair",
        },
      ],
    });
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
