function extraiLinks (listaDeLinks) {
    return listaDeLinks.map((valorLink) => Object.values(valorLink).join());
}

async function checaStatus (listaURLs) {
    const listaStatus = await Promise.all(
        listaURLs.map(async (url) => {
            try {
                const response = await fetch(url);
                return (`${response.status} - ${response.statusText}`);
            } catch (error) {
                return manejaErro(error);
            }
        })
    );
    return listaStatus;
}

function manejaErro (error) {
    if (error.cause.code === 'ENOTFOUND') {
        return 'Link não encontrado.';
    } else {
        return 'Ocorreu algum erro.';
    }
}

export default async function validaLista (listaDeLinks) {
    const links = extraiLinks(listaDeLinks);
    const status = await checaStatus(links);

    return listaDeLinks.map((objeto, indice) => ({
        ...objeto,
        status: status[indice]
    }))
}
