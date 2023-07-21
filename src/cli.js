import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';

const caminhoDoArquivo = process.argv;

function imprimeLista(resultado, nomeDoArquivo = '') {
  console.log(
    chalk.cyan('lista de links'),
    chalk.black.bgCyan(nomeDoArquivo),
    resultado);
}

async function processaTexto(argumentos) {
  const caminho = argumentos[2];

  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log(chalk.red('Arquivo ou diretório não existe'));
      return;
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    const resultado = await pegaArquivo(caminho);
    imprimeLista(resultado);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    const arquivos = await fs.promises.readdir(caminho)
    arquivos.forEach(async (nomeDoArquivo) => {
      const lista = await pegaArquivo(`${caminho}/${nomeDoArquivo}`)
      imprimeLista(lista, nomeDoArquivo)
    })
  }
}

processaTexto(caminhoDoArquivo);