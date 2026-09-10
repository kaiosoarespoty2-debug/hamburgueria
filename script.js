/* =========================================================
   CONFIGURAÇÕES DO SISTEMA
========================================================= */


// Número do WhatsApp da hamburgueria.
// Deve ser informado somente com números.
const NUMERO_WHATSAPP = "558391503777";


// Taxa cobrada quando o cliente escolhe entrega.
const TAXA_ENTREGA = 5;


// Produto utilizado atualmente no modal.
let produtoModal = null;


// Categoria atualmente selecionada.
let categoriaAtual = "Todos";


// Carrinho de compras.
let carrinho = [];


// Dados do cliente.
let cliente = {
    nome: "",
    telefone: ""
};


/* =========================================================
   PRODUTOS
========================================================= */


/*
    Para adicionar um novo produto:

    1. Copie um dos objetos abaixo.
    2. Altere o id.
    3. Altere nome, categoria, preço e descrição.
    4. Coloque a foto na pasta "imagens".
    5. Informe o caminho no campo "imagem".

    Exemplo:

    imagem: "imagens/x-calabresa.jpg"
*/

const produtos = [

    {
        id: 1,

        nome: "X-Tudo",

        categoria: "Hambúrgueres",

        preco: 20,

        imagem: "",

        emoji: "🍔",

        descricao:
            "Hambúrguer, queijo, presunto, ovo, salada e molho especial."
    },


    {
        id: 2,

        nome: "X-Bacon",

        categoria: "Hambúrgueres",

        preco: 18,

        imagem: "",

        emoji: "🥓",

        descricao:
            "Hambúrguer, queijo, bacon crocante e salada."
    },


    {
        id: 3,

        nome: "X-Salada",

        categoria: "Hambúrgueres",

        preco: 16,

        imagem: "",

        emoji: "🥬",

        descricao:
            "Hambúrguer, queijo, alface, tomate e molho especial."
    },


    {
        id: 4,

        nome: "X-Frango",

        categoria: "Hambúrgueres",

        preco: 19,

        imagem: "",

        emoji: "🍗",

        descricao:
            "Frango, queijo, salada e molho especial."
    },


    {
        id: 5,

        nome: "Combo Fast",

        categoria: "Combos",

        preco: 28,

        imagem: "",

        emoji: "🍔🍟",

        descricao:
            "Hambúrguer, batata frita e refrigerante."
    },


    {
        id: 6,

        nome: "Batata Frita",

        categoria: "Acompanhamentos",

        preco: 10,

        imagem: "",

        emoji: "🍟",

        descricao:
            "Batata frita crocante e sequinha."
    },


    {
        id: 7,

        nome: "Nuggets",

        categoria: "Acompanhamentos",

        preco: 12,

        imagem: "",

        emoji: "🍗",

        descricao:
            "Porção de nuggets crocantes."
    },


    {
        id: 8,

        nome: "Refrigerante",

        categoria: "Bebidas",

        preco: 7,

        imagem: "",

        emoji: "🥤",

        descricao:
            "Refrigerante gelado de 350ml."
    },


    /*
        NOVO ITEM DE EXEMPLO

        Para ativar uma foto real:

        imagem:
            "imagens/x-calabresa.jpg"

        Caso "imagem" fique vazia,
        o sistema mostra o emoji.
    */

    {
        id: 9,

        nome: "X-Calabresa",

        categoria: "Hambúrgueres",

        preco: 22,

        imagem: "",

        emoji: "🍔",

        descricao:
            "Hambúrguer, calabresa, queijo, salada e molho especial."
    }

];


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */


// Formata um número para moeda brasileira.
function dinheiro(valor) {

    return "R$ " +
        valor
            .toFixed(2)
            .replace(".", ",");
}


/*
    Remove caracteres que não sejam números
    e aplica máscara de telefone.
*/
function mascaraTelefone(input) {

    let valor =
        input.value
            .replace(/\D/g, "")
            .slice(0, 11);


    if (valor.length <= 10) {

        valor = valor.replace(
            /^(\d{2})(\d{4})(\d{0,4}).*/,
            "($1) $2-$3"
        );

    } else {

        valor = valor.replace(
            /^(\d{2})(\d{5})(\d{0,4}).*/,
            "($1) $2-$3"
        );
    }


    input.value = valor;
}


/* =========================================================
   CADASTRO
========================================================= */


// Valida o cadastro e abre o cardápio.
function entrarNoCardapio() {

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();


    const telefone =
        document
            .getElementById("telefone")
            .value
            .trim();


    if (nome === "") {

        alert("Digite seu nome.");

        return;
    }


    const telefoneNumeros =
        telefone.replace(/\D/g, "");


    if (telefoneNumeros.length < 10) {

        alert(
            "Digite um telefone válido."
        );

        return;
    }


    cliente = {
        nome: nome,
        telefone: telefone
    };


    // Salva os dados para facilitar um próximo acesso.
    localStorage.setItem(
        "fastZapCliente",
        JSON.stringify(cliente)
    );


    document
        .getElementById("nomeCliente")
        .textContent = cliente.nome;


    document
        .getElementById("telaCadastro")
        .style.display = "none";


    document
        .getElementById("telaCardapio")
        .style.display = "block";


    carregarCardapio();

    atualizarCarrinho();
}


// Volta para a tela de cadastro.
function voltarCadastro() {

    document
        .getElementById("telaCardapio")
        .style.display = "none";


    document
        .getElementById("telaCadastro")
        .style.display = "flex";
}


/* =========================================================
   CARDÁPIO
========================================================= */


// Cria os botões de categoria.
function carregarCategorias() {

    const categorias = [
        "Todos",
        ...new Set(
            produtos.map(
                produto =>
                    produto.categoria
            )
        )
    ];


    const elemento =
        document.getElementById(
            "categorias"
        );


    elemento.innerHTML = "";


    categorias.forEach(
        function(categoria) {

            const botao =
                document.createElement(
                    "button"
                );


            botao.className =
                "categoria-btn";


            if (
                categoria ===
                categoriaAtual
            ) {

                botao.classList.add(
                    "ativa"
                );
            }


            botao.textContent =
                categoria;


            botao.onclick =
                function() {

                    categoriaAtual =
                        categoria;

                    carregarCategorias();

                    filtrarProdutos();
                };


            elemento.appendChild(
                botao
            );
        }
    );
}


/*
    Filtra produtos pela categoria
    e pelo texto digitado na busca.
*/
function filtrarProdutos() {

    const busca =
        document
            .getElementById("busca")
            .value
            .toLowerCase()
            .trim();


    const lista =
        document.getElementById(
            "listaProdutos"
        );


    lista.innerHTML = "";


    const produtosFiltrados =
        produtos.filter(
            function(produto) {

                const categoriaOk =
                    categoriaAtual ===
                    "Todos" ||
                    produto.categoria ===
                    categoriaAtual;


                const buscaOk =
                    produto.nome
                        .toLowerCase()
                        .includes(busca) ||

                    produto.descricao
                        .toLowerCase()
                        .includes(busca);


                return (
                    categoriaOk &&
                    buscaOk
                );
            }
        );


    if (
        produtosFiltrados.length === 0
    ) {

        lista.innerHTML = `

            <div class="sem-produtos">

                🔎

                <h3>
                    Nenhum produto encontrado
                </h3>

                <p>
                    Tente procurar por outro nome.
                </p>

            </div>

        `;

        return;
    }


    produtosFiltrados.forEach(
        function(produto) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "produto";


            /*
                Se houver uma imagem cadastrada,
                mostra a foto.

                Caso contrário,
                mostra o emoji.
            */

            let imagemHTML = "";


            if (produto.imagem) {

                imagemHTML = `

                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                        loading="lazy"
                    >

                `;

            } else {

                imagemHTML =
                    produto.emoji;
            }


            card.innerHTML = `

                <div class="produto-imagem">

                    ${imagemHTML}

                </div>


                <div class="produto-conteudo">

                    <div class="produto-categoria">

                        ${produto.categoria}

                    </div>


                    <h3>
                        ${produto.nome}
                    </h3>


                    <p class="produto-descricao">

                        ${produto.descricao}

                    </p>


                    <div class="produto-rodape">

                        <span class="produto-preco">

                            ${dinheiro(
                                produto.preco
                            )}

                        </span>


                        <button
                            class="btn-adicionar"
                            onclick="abrirModalProduto(${produto.id})"
                        >
                            + Adicionar
                        </button>

                    </div>

                </div>

            `;


            lista.appendChild(card);
        }
    );
}


// Inicializa o cardápio.
function carregarCardapio() {

    carregarCategorias();

    filtrarProdutos();
}


/* =========================================================
   MODAL DE PRODUTO
========================================================= */


// Abre a janela de personalização.
function abrirModalProduto(id) {

    produtoModal =
        produtos.find(
            produto =>
                produto.id === id
        );


    if (!produtoModal) {
        return;
    }


    document
        .getElementById("modalNome")
        .textContent =
        produtoModal.nome;


    document
        .getElementById("modalDescricao")
        .textContent =
        produtoModal.descricao;


    document
        .getElementById("modalPreco")
        .textContent =
        dinheiro(
            produtoModal.preco
        );


    document
        .getElementById(
            "observacaoProduto"
        )
        .value = "";


    document
        .querySelectorAll(
            '#modalProduto input[type="checkbox"]'
        )
        .forEach(
            checkbox =>
                checkbox.checked = false
        );


    document
        .getElementById(
            "modalProduto"
        )
        .style.display = "flex";
}


// Fecha a janela de personalização.
function fecharModal() {

    document
        .getElementById(
            "modalProduto"
        )
        .style.display = "none";


    produtoModal = null;
}


// Recalcula o preço com os adicionais.
function atualizarPrecoModal() {

    if (!produtoModal) {
        return;
    }


    let preco =
        produtoModal.preco;


    document
        .querySelectorAll(
            '#modalProduto input[type="checkbox"]:checked'
        )
        .forEach(
            function(checkbox) {

                preco += Number(
                    checkbox.dataset.preco
                );
            }
        );


    document
        .getElementById("modalPreco")
        .textContent =
        dinheiro(preco);
}


/*
    Cria uma cópia do produto no carrinho
    com adicionais e observações.
*/
function adicionarProdutoPersonalizado() {

    if (!produtoModal) {
        return;
    }


    let preco =
        produtoModal.preco;


    const adicionais = [];


    document
        .querySelectorAll(
            '#modalProduto input[type="checkbox"]:checked'
        )
        .forEach(
            function(checkbox) {

                preco += Number(
                    checkbox.dataset.preco
                );


                adicionais.push(
                    checkbox.value
                );
            }
        );


    const observacao =
        document
            .getElementById(
                "observacaoProduto"
            )
            .value
            .trim();


    carrinho.push({

        produtoId:
            produtoModal.id,

        nome:
            produtoModal.nome,

        preco:
            preco,

        quantidade:
            1,

        adicionais:
            adicionais,

        observacao:
            observacao

    });


    atualizarCarrinho();

    fecharModal();
}


/* =========================================================
   CARRINHO
========================================================= */


// Aumenta a quantidade de um item.
function aumentarQuantidade(indice) {

    carrinho[indice].quantidade++;

    atualizarCarrinho();
}


// Diminui a quantidade de um item.
function diminuirQuantidade(indice) {

    carrinho[indice].quantidade--;


    /*
        Quando a quantidade chega a zero,
        o item é removido automaticamente.
    */

    if (
        carrinho[indice].quantidade <= 0
    ) {

        carrinho.splice(
            indice,
            1
        );
    }


    atualizarCarrinho();
}


// Remove completamente um item.
function removerItem(indice) {

    carrinho.splice(
        indice,
        1
    );


    atualizarCarrinho();
}


// Remove todos os produtos.
function limparCarrinho() {

    if (
        carrinho.length === 0
    ) {

        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente limpar o carrinho?"
        );


    if (!confirmar) {
        return;
    }


    carrinho = [];


    atualizarCarrinho();
}


/*
    Atualiza a interface do carrinho,
    quantidades, subtotal, taxa e total.
*/
function atualizarCarrinho() {

    const lista =
        document.getElementById(
            "listaCarrinho"
        );


    lista.innerHTML = "";


    let subtotal = 0;

    let quantidadeTotal = 0;


    if (
        carrinho.length === 0
    ) {

        lista.innerHTML = `

            <p class="carrinho-vazio">

                🛒 Seu carrinho está vazio.

            </p>

        `;

    }


    carrinho.forEach(
        function(produto, indice) {

            const valorProduto =
                produto.preco *
                produto.quantidade;


            subtotal +=
                valorProduto;


            quantidadeTotal +=
                produto.quantidade;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "item-carrinho";


            let adicionaisTexto = "";


            if (
                produto.adicionais &&
                produto.adicionais.length > 0
            ) {

                adicionaisTexto =
                    "Adicionais: " +
                    produto.adicionais.join(
                        ", "
                    );
            }


            item.innerHTML = `

                <div>

                    <div class="item-nome">

                        ${produto.nome}

                    </div>


                    <div class="item-detalhes">

                        ${dinheiro(produto.preco)}
                        cada

                        ${
                            adicionaisTexto
                                ? "<br>" +
                                  adicionaisTexto
                                : ""
                        }

                    </div>


                    ${
                        produto.observacao
                            ? `

                                <div class="item-observacao">

                                    📝
                                    ${produto.observacao}

                                </div>

                              `
                            : ""
                    }

                </div>


                <div class="controle-quantidade">

                    <button
                        class="btn-quantidade"
                        onclick="diminuirQuantidade(${indice})"
                        aria-label="Diminuir quantidade"
                    >
                        −
                    </button>


                    <span class="quantidade">

                        ${produto.quantidade}

                    </span>


                    <button
                        class="btn-quantidade"
                        onclick="aumentarQuantidade(${indice})"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>

                </div>


                <div class="item-subtotal">

                    ${dinheiro(valorProduto)}

                    <br>

                    <button
                        onclick="removerItem(${indice})"
                        style="
                            border:none;
                            background:none;
                            color:#c62828;
                            font-size:12px;
                            margin-top:5px;
                        "
                    >
                        🗑 Remover
                    </button>

                </div>

            `;


            lista.appendChild(item);
        }
    );


    const entrega =
        document.querySelector(
            'input[name="entrega"]:checked'
        );


    const taxa =
        entrega &&
        entrega.value === "Entrega"
            ? TAXA_ENTREGA
            : 0;


    const total =
        subtotal + taxa;


    document
        .getElementById("subtotal")
        .textContent =
        dinheiro(subtotal);


    document
        .getElementById("taxaEntrega")
        .textContent =
        dinheiro(taxa);


    document
        .getElementById("total")
        .textContent =
        dinheiro(total);


    document
        .getElementById("contadorItens")
        .textContent =
        quantidadeTotal;


    document
        .getElementById("contadorFlutuante")
        .textContent =
        quantidadeTotal;


    document
        .getElementById("totalFlutuante")
        .textContent =
        dinheiro(total);
}


/* =========================================================
   ENTREGA
========================================================= */


// Mostra ou esconde os campos de endereço.
function mostrarEndereco() {

    const entrega =
        document.querySelector(
            'input[name="entrega"]:checked'
        );


    const formulario =
        document.getElementById(
            "formEndereco"
        );


    if (
        entrega &&
        entrega.value === "Entrega"
    ) {

        formulario.style.display =
            "block";

    } else {

        formulario.style.display =
            "none";
    }


    atualizarCarrinho();
}


// Retorna os dados do endereço.
function pegarEndereco() {

    return {

        rua:
            document
                .getElementById("rua")
                .value
                .trim(),

        numero:
            document
                .getElementById("numero")
                .value
                .trim(),

        bairro:
            document
                .getElementById("bairro")
                .value
                .trim(),

        referencia:
            document
                .getElementById("referencia")
                .value
                .trim()
    };
}


/* =========================================================
   PAGAMENTO
========================================================= */


// Mostra o campo de troco somente para dinheiro.
function mostrarTroco() {

    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    const campo =
        document.getElementById(
            "campoTroco"
        );


    if (
        pagamento &&
        pagamento.value === "Dinheiro"
    ) {

        campo.style.display =
            "block";

    } else {

        campo.style.display =
            "none";
    }
}


/* =========================================================
   CÁLCULOS
========================================================= */


// Calcula o subtotal dos produtos.
function calcularSubtotal() {

    let subtotal = 0;


    carrinho.forEach(
        function(produto) {

            subtotal +=
                produto.preco *
                produto.quantidade;
        }
    );


    return subtotal;
}


// Calcula o total com a taxa.
function calcularTotal() {

    const subtotal =
        calcularSubtotal();


    const entrega =
        document.querySelector(
            'input[name="entrega"]:checked'
        );


    const taxa =
        entrega &&
        entrega.value === "Entrega"
            ? TAXA_ENTREGA
            : 0;


    return subtotal + taxa;
}


/* =========================================================
   VALIDAÇÃO DO PEDIDO
========================================================= */


// Verifica se todos os dados necessários foram preenchidos.
function validarPedido() {

    if (
        carrinho.length === 0
    ) {

        alert(
            "Adicione pelo menos um produto ao carrinho."
        );

        return false;
    }


    const entrega =
        document.querySelector(
            'input[name="entrega"]:checked'
        );


    if (!entrega) {

        alert(
            "Escolha entre entrega ou retirada."
        );

        return false;
    }


    if (
        entrega.value === "Entrega"
    ) {

        const endereco =
            pegarEndereco();


        if (
            endereco.rua === "" ||
            endereco.numero === "" ||
            endereco.bairro === ""
        ) {

            alert(
                "Preencha rua, número e bairro."
            );

            return false;
        }
    }


    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    if (!pagamento) {

        alert(
            "Escolha a forma de pagamento."
        );

        return false;
    }


    if (
        pagamento.value === "Dinheiro"
    ) {

        const troco =
            Number(
                document
                    .getElementById("troco")
                    .value
            );


        const total =
            calcularTotal();


        if (
            !troco ||
            troco < total
        ) {

            alert(
                "Informe um valor de troco maior ou igual ao total."
            );

            return false;
        }
    }


    const formaPedido =
        document.querySelector(
            'input[name="formaPedido"]:checked'
        );


    if (!formaPedido) {

        alert(
            "Escolha WhatsApp ou pedido pelo site."
        );

        return false;
    }


    return true;
}


/* =========================================================
   RESUMO
========================================================= */


// Mostra o resumo antes da confirmação.
function mostrarResumo() {

    if (!validarPedido()) {
        return;
    }


    const entrega =
        document.querySelector(
            'input[name="entrega"]:checked'
        );


    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    const formaPedido =
        document.querySelector(
            'input[name="formaPedido"]:checked'
        );


    const subtotal =
        calcularSubtotal();


    const taxa =
        entrega.value === "Entrega"
            ? TAXA_ENTREGA
            : 0;


    const total =
        subtotal + taxa;


    let html = `

        <div style="margin-top:15px;">

            <p>
                <strong>Cliente:</strong>
                ${cliente.nome}
            </p>

            <p>
                <strong>Telefone:</strong>
                ${cliente.telefone}
            </p>

            <p>
                <strong>Recebimento:</strong>
                ${entrega.value}
            </p>

    `;


    if (
        entrega.value === "Entrega"
    ) {

        const endereco =
            pegarEndereco();


        html += `

            <p>

                <strong>Endereço:</strong>

                ${endereco.rua},
                ${endereco.numero}
                -
                ${endereco.bairro}

            </p>

        `;


        if (
            endereco.referencia
        ) {

            html += `

                <p>

                    <strong>
                        Referência:
                    </strong>

                    ${endereco.referencia}

                </p>

            `;
        }
    }


    html += `

            <p>

                <strong>
                    Pagamento:
                </strong>

                ${pagamento.value}

            </p>

    `;


    if (
        pagamento.value === "Dinheiro"
    ) {

        const troco =
            Number(
                document
                    .getElementById("troco")
                    .value
            );


        html += `

            <p>

                <strong>
                    Troco para:
                </strong>

                ${dinheiro(troco)}

            </p>

        `;
    }


    html += `

        </div>

        <hr
            style="
                margin:15px 0;
                border:none;
                border-top:1px solid #ddd;
            "
        >

        <h4>
            Itens do pedido
        </h4>

    `;


    carrinho.forEach(
        function(produto) {

            const subtotalProduto =
                produto.preco *
                produto.quantidade;


            html += `

                <div
                    class="resumo-pedido-item"
                >

                    <span>

                        ${produto.nome}
                        x${produto.quantidade}

                    </span>


                    <strong>

                        ${dinheiro(
                            subtotalProduto
                        )}

                    </strong>

                </div>

            `;
        }
    );


    html += `

        <div style="margin-top:15px;">

            <div class="linha-valor">

                <span>
                    Subtotal
                </span>

                <strong>
                    ${dinheiro(subtotal)}
                </strong>

            </div>


            <div class="linha-valor">

                <span>
                    Entrega
                </span>

                <strong>
                    ${dinheiro(taxa)}
                </strong>

            </div>


            <div class="linha-total">

                <span>
                    Total
                </span>

                <span>
                    ${dinheiro(total)}
                </span>

            </div>

        </div>


        <p
            style="
                margin-top:15px;
                color:#777;
                font-size:13px;
            "
        >

            Forma escolhida:
            ${
                formaPedido.value === "whatsapp"
                    ? "📱 WhatsApp"
                    : "🌐 Pelo site"
            }

        </p>

    `;


    document
        .getElementById(
            "conteudoResumo"
        )
        .innerHTML = html;


    document
        .getElementById(
            "areaResumo"
        )
        .style.display = "block";


    document
        .getElementById(
            "areaResumo"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// Fecha o resumo.
function fecharResumo() {

    document
        .getElementById(
            "areaResumo"
        )
        .style.display = "none";
}


/* =========================================================
   CONFIRMAÇÃO
========================================================= */


// Decide qual método de finalização será utilizado.
function confirmarPedido() {

    const formaPedido =
        document.querySelector(
            'input[name="formaPedido"]:checked'
        );


    if (
        formaPedido.value === "whatsapp"
    ) {

        enviarWhatsApp();

    } else {

        finalizarPeloSite();
    }
}


/* =========================================================
   WHATSAPP
========================================================= */


// Monta e abre o pedido no WhatsApp.
function enviarWhatsApp() {

    const entrega =
        document.querySelector(
            'input[name="entrega"]:checked'
        );


    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    const subtotal =
        calcularSubtotal();


    const taxa =
        entrega.value === "Entrega"
            ? TAXA_ENTREGA
            : 0;


    const total =
        subtotal + taxa;


    const partesMensagem = [];


    partesMensagem.push(
        "🍔 *NOVO PEDIDO - FAST-ZAP*"
    );


    partesMensagem.push(
        `*Cliente:* ${cliente.nome}`
    );


    partesMensagem.push(
        `*Telefone:* ${cliente.telefone}`
    );


    partesMensagem.push(
        `*Recebimento:* ${entrega.value}`
    );


    if (
        entrega.value === "Entrega"
    ) {

        const endereco =
            pegarEndereco();


        partesMensagem.push(
            `*Endereço:* ${endereco.rua}, ${endereco.numero} - ${endereco.bairro}`
        );


        if (
            endereco.referencia
        ) {

            partesMensagem.push(
                `*Referência:* ${endereco.referencia}`
            );
        }
    }


    partesMensagem.push(
        `*Pagamento:* ${pagamento.value}`
    );


    if (
        pagamento.value === "Dinheiro"
    ) {

        const troco =
            document
                .getElementById("troco")
                .value;


        partesMensagem.push(
            `*Troco para:* R$ ${troco}`
        );
    }


    partesMensagem.push(
        "",
        "*ITENS DO PEDIDO*"
    );


    carrinho.forEach(
        function(produto) {

            const subtotalProduto =
                produto.preco *
                produto.quantidade;


            partesMensagem.push(
                `• ${produto.nome} x${produto.quantidade} - ${dinheiro(subtotalProduto)}`
            );


            if (
                produto.adicionais &&
                produto.adicionais.length
            ) {

                partesMensagem.push(
                    `  Adicionais: ${produto.adicionais.join(", ")}`
                );
            }


            if (
                produto.observacao
            ) {

                partesMensagem.push(
                    `  Obs.: ${produto.observacao}`
                );
            }
        }
    );


    const observacaoGeral =
        document
            .getElementById(
                "observacaoGeral"
            )
            .value
            .trim();


    if (
        observacaoGeral
    ) {

        partesMensagem.push(
            "",
            `*Observação geral:* ${observacaoGeral}`
        );
    }


    partesMensagem.push(
        "",
        `*Subtotal:* ${dinheiro(subtotal)}`,
        `*Entrega:* ${dinheiro(taxa)}`,
        `*TOTAL:* ${dinheiro(total)}`
    );


    const mensagem =
        partesMensagem.join("\n");


    const link =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(
            mensagem
        );


    window.open(
        link,
        "_blank"
    );


    mostrarTelaPedido();
}


/* =========================================================
   PEDIDO PELO SITE
========================================================= */


// Finaliza o pedido dentro do próprio site.
function finalizarPeloSite() {

    mostrarTelaPedido();
}


/*
    Gera um número simples de pedido
    e mostra a tela de confirmação.
*/
function mostrarTelaPedido() {

    const numero =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    document
        .getElementById(
            "numeroPedido"
        )
        .textContent =
        "Pedido #" + numero;


    document
        .getElementById(
            "telaCardapio"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "telaPedido"
        )
        .style.display =
        "block";


    /*
        Guarda uma cópia do último pedido
        no navegador.
    */
    localStorage.setItem(
        "fastZapUltimoPedido",
        JSON.stringify({

            numero:
                numero,

            cliente:
                cliente,

            carrinho:
                carrinho,

            total:
                calcularTotal()

        })
    );


    iniciarStatusPedido();


    // Limpa o carrinho depois da confirmação.
    carrinho = [];

    atualizarCarrinho();
}


/* =========================================================
   STATUS DO PEDIDO
========================================================= */


// Simula a evolução do pedido.
function iniciarStatusPedido() {

    document
        .querySelectorAll(
            ".status"
        )
        .forEach(
            status =>
                status.classList.remove(
                    "ativo"
                )
        );


    document
        .getElementById(
            "status1"
        )
        .classList.add(
            "ativo"
        );


    setTimeout(
        function() {

            document
                .getElementById(
                    "status2"
                )
                .classList.add(
                    "ativo"
                );

        },
        3000
    );


    setTimeout(
        function() {

            document
                .getElementById(
                    "status3"
                )
                .classList.add(
                    "ativo"
                );

        },
        7000
    );


    setTimeout(
        function() {

            document
                .getElementById(
                    "status4"
                )
                .classList.add(
                    "ativo"
                );

        },
        11000
    );
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */


// Volta para o cardápio.
function voltarAoCardapio() {

    document
        .getElementById(
            "telaPedido"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "telaCardapio"
        )
        .style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Leva o usuário até o carrinho.
function irParaCarrinho() {

    document
        .getElementById(
            "carrinho"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */


// Executa quando a página termina de carregar.
window.addEventListener(
    "load",
    function() {

        const clienteSalvo =
            localStorage.getItem(
                "fastZapCliente"
            );


        if (!clienteSalvo) {
            return;
        }


        try {

            cliente =
                JSON.parse(
                    clienteSalvo
                );


            if (
                cliente.nome &&
                cliente.telefone
            ) {

                document
                    .getElementById(
                        "nome"
                    )
                    .value =
                    cliente.nome;


                document
                    .getElementById(
                        "telefone"
                    )
                    .value =
                    cliente.telefone;
            }

        }

        catch (erro) {

            console.error(
                "Erro ao carregar cliente:",
                erro
            );
        }

    }
);