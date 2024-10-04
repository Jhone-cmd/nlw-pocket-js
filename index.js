// const {} = require("@inquirer/prompts"); CommonJs

import { input, select } from "@inquirer/prompts"; // EsModule
import fs from "node:fs/promises";

let metas;

const carregarMetas = async () => {
  try {
    const dados = await fs.readFile("./metas.json", "utf-8");
    metas = JSON.parse(dados);
  } catch (error) {
    return (metas = []);
  }
};

const salvarMetas = async () => {
  await fs.writeFile("./metas.json", JSON.stringify(metas, null, 2));
};

const cadastrarMeta = async () => {
  const meta = await input({
    message: "Digite uma meta:",
  });

  if (meta.length === 0) {
    console.log("Você precisa informar uma meta!");
  }

  metas.push({
    name: meta,
    checked: false,
  });
};

async function start() {
  await carregarMetas();
  while (true) {
    await salvarMetas();

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
          name: "Sair",
          value: "sair",
        },
      ],
    });

    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
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
