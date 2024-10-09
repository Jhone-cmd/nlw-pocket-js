// const {} = require("@inquirer/prompts"); // CommonJs

import { input, select, checkbox } from "@inquirer/prompts"; // EsModule
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

const listarMetas = async () => {
  if (metas.length === 0) {
    console.log("Nenhuma meta encontrada!");
    return;
  }

  const respostas = await checkbox({
    message:
      "Use as Setas para alternar entre metas, o Espaço para marcar/desmarcar e o Enter para finalizar esta etapa.",
    choices: [...metas],
    instructions: false,
  });

  if (respostas.length === 0) {
    console.log("Nenhuma meta selecionada!");
    return;
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.name === resposta;
    });
    if (!meta) {
      console.log(`Meta não encontrada para: ${resposta}`);
      return; // Adicione um return para evitar erros
    }

    meta.checked = true;
  });
};

const metasRealizadas = async () => {
  if (metas.length === 0) {
    console.log("Nenhuma meta encontrada!");
    return;
  }

  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });

  if (realizadas.length === 0) {
    console.log("Nenhuma meta realizada! :(");
    return;
  }

  await select({
    message: "Metas Realizadas",
    choices: [...realizadas],
  });

  console.log("Metas concluídas: " + realizadas.length);
};

const metasPendentes = async () => {
  if (metas.length === 0) {
    console.log("Nenhuma meta encontrada!");
    return;
  }

  const pendentes = metas.filter((meta) => {
    return !meta.checked;
  });

  if (pendentes.length === 0) {
    console.log("Nenhuma meta pendente! :)");
    return;
  }

  await select({
    message: "Metas Realizadas",
    choices: [...pendentes],
  });

  console.log("Metas concluídas: " + pendentes.length);
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
          value: "listar",
        },
        {
          name: "Metas Realizadas",
          value: "realizadas",
        },
        {
          name: "Metas Pendentes",
          value: "pendentes",
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
        await listarMetas();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "pendentes":
        await metasPendentes();
        break;
      case "sair":
        console.log("Saindo do sistema. Até a próxima! 👋");
        return;
    }
  }
}

start();
