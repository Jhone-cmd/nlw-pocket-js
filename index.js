import { input, select, checkbox } from "@inquirer/prompts"; // EsModule
import { log } from "node:console";
import fs from "node:fs/promises";

let mensagem = "Bem vindo ao app In.orbit (Gerenciador de Metas)";
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
    mensagem = "Você precisa informar uma meta!";
    return;
  }

  metas.push({
    value: meta,
    checked: false,
  });

  mensagem = "Meta cadastrada com sucesso! :)";
};

const listarMetas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta encontrada!";
    return;
  }

  const respostas = await checkbox({
    message:
      "Use as Setas para alternar entre metas, o Espaço para marcar/desmarcar e o Enter para finalizar esta etapa.",
    choices: [...metas],
    instructions: false,
  });

  metas.forEach((m) => {
    m.checked = false;
  });

  if (respostas.length === 0) {
    mensagem = "Nenhuma meta selecionada!";
    return;
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value === resposta;
    });

    meta.checked = true;
  });
};

const metasRealizadas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta encontrada!";
    return;
  }

  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });

  if (realizadas.length === 0) {
    mensagem = "Nenhuma meta realizada! :(";
    return;
  }

  await select({
    message: "Metas Realizadas",
    choices: [...realizadas],
  });

  mensagem = "Meta(s) concluída(s): " + realizadas.length;
};

const metasPendentes = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta encontrada!";
    return;
  }

  const pendentes = metas.filter((meta) => {
    return !meta.checked;
  });

  if (pendentes.length === 0) {
    mensagem = "Nenhuma meta pendente! :)";
    return;
  }

  await select({
    message: "Metas Pendentes",
    choices: [...pendentes],
  });

  mensagem = "Meta(s) Pendente(s): " + pendentes.length;
};

const deletarMetas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta encontrada!";
    return;
  }

  const metasPendentes = metas.map((meta) => {
    return { value: meta.value, checked: false };
  });

  const metasParaDeletar = await checkbox({
    message:
      "Use as Setas para alternar entre metas, o Espaço para marcar/desmarcar e o Enter para finalizar esta etapa.",
    choices: [...metasPendentes],
    instructions: false,
  });

  if (metasParaDeletar.length === 0) {
    mensagem = "Nenhuma meta para deletar!";
    return;
  }

  metasParaDeletar.forEach((meta) => {
    metas = metas.filter((m) => {
      return m.value !== meta;
    });
  });

  mensagem = "Meta(s) deletadas(s) com sucesso";
};

const mostrarMensagem = () => {
  console.clear();

  if (mensagem !== "") {
    console.log(mensagem);
    console.log("");
    mensagem = "";
  }
};

async function start() {
  await carregarMetas();

  while (true) {
    mostrarMensagem();
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
          name: "Deletar Metas",
          value: "deletar",
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
      case "deletar":
        await deletarMetas();
        break;
      case "sair":
        mostrarMensagem();
        console.log("Saindo do sistema. Até a próxima! 👋");
        return;
    }
  }
}

start();
