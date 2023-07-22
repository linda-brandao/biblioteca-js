#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';
import validaLista from './http-validacao.js';

const caminhoDoArquivo = process.argv;

async function imprimeLista(valida, lista, nomeDoArquivo = '') {
    if (valida) {
        console.log(
            chalk.cyan('lista de links'),
            chalk.black.bgCyan(nomeDoArquivo),
            await validaLista(lista));
    } else {
        console.log(
            chalk.cyan('lista de links'),
            chalk.black.bgCyan(nomeDoArquivo),
            lista);
    }
}

async function processaTexto(argumentos) {
    const caminho = argumentos[2];
    const valida = argumentos[3] === '--valida';

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
        imprimeLista(valida, resultado);
    } else if (fs.lstatSync(caminho).isDirectory()) {
        const arquivos = await fs.promises.readdir(caminho);
        arquivos.forEach(async (nomeDoArquivo) => {
            const listaDeLinks = await pegaArquivo(`${caminho}/${nomeDoArquivo}`);
            imprimeLista(valida, listaDeLinks, nomeDoArquivo);
        })
    }
}

processaTexto(caminhoDoArquivo);