//Função do bootstrap que valida o Login
//Bootstrap function that validates Logi
(function () {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})();

//Função que valida o Login para poder mudar a página
//Function that validates the Login to be able to change the page
function acesso() {
    const dados = document.getElementById("form");
    const isValid = dados.checkValidity();

    if (isValid == true) {
        //Função que armazena dados de login em localStorage
        //Function that stores login data in localStorage
        const handleFormSubmit = event => {
            event.preventDefault();

            const data = new FormData(event.target);

            const value = Object.fromEntries(data.entries());

            console.log(value);
        };
        //Chama a função ao enviar as informações
        //Call the function when sending the information
        const form = document.getElementsByClassName('form-data')[0];
        form.addEventListener('submit', handleFormSubmit);
        // window.location.href = "produto.html";
    }
};

//Função que faz requisição com a VTEX e retorna as informações
//Função que faz requisição com a VTEX e retorna as informações
function gerar() {

    //Limpar os dados para uma nova pesquisa
    //Clear data for a new search
    document.querySelector('.pai').innerHTML = ''

    const userData = JSON.parse(localStorage.getItem('dados'));

    //1237862776512-01
    //1238081274635-01
    //1238301476768-01
    //1238310669840-01
    axios({
        method: 'get',
        url: 'https://' + userData.storeName + '.vtexcommercestable.com.br/api/oms/pvt/orders/' + document.querySelector("#busca").value,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': userData.apiKey,
            'X-VTEX-API-AppToken': userData.apiToken
        }
    }).then(response => {

        //Função que formata o valor em real
        function formatReal(int) {
            var tmp = int + '';
            tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
            if (tmp.length > 6)
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

            return tmp;
        }

        //Função que converte data
        function convertDate(dateString) {
            var p = dateString.split(/\D/g)
            return [p[2], p[1], p[0]].join("-")
        }

        const result = (response.data);

        //Nome da loja
        const nomeLoja = result.hostname;
        document.querySelector('.nome-loja').textContent = nomeLoja;

        //Logo loja
        const logoLoja = result.sellers;
        if (logoLoja[0].logo != '') {
            document.querySelector('.logo-loja').src = logoLoja[0].logo;
        }

        //Nome do cliente
        const nome = result.clientProfileData;
        document.querySelector('.nome-cliente').textContent = nome.firstName +
            ' ' + nome.lastName;

        //Endereço do cliente
        const endereco = result.shippingData.address;
        document.querySelector('.rua-numero').textContent = endereco.street +
            ',' + endereco.number;
        document.querySelector('.bairro').textContent = endereco.neighborhood;
        document.querySelector('.cidade-estado').textContent = endereco.city +
            '/' + endereco.state;
        document.querySelector('.cep-pais').textContent = endereco
            .postalCode + '-' + endereco.country;

        const moeda = result.storePreferencesData.currencyCode;

        //Dados dos itens comprados (cria um a cada produto encontrado)
        const items = result.items;
        items.forEach(function (elemento) {
            const pai = document.querySelector('.pai');

            const pedidos = document.createElement('div');
            pedidos.classList.add('card1');
            pai.appendChild(pedidos);

            const flex = document.createElement('div');
            flex.classList.add('flex');
            pedidos.appendChild(flex);

            const separa = document.createElement('div');
            separa.classList.add('div-img')
            flex.appendChild(separa);

            //Imagem do produto
            const imagemProduto = document.createElement('img');
            imagemProduto.src = elemento.imageUrl;
            separa.appendChild(imagemProduto);

            const separa2 = document.createElement('div');
            separa2.classList.add('div-cem');
            flex.appendChild(separa2);

            //Nome do produto
            const nomeProduto = document.createElement('p');
            nomeProduto.textContent = elemento.name;
            separa2.appendChild(nomeProduto);

            //Id do produto
            const idProduto = document.createElement('p');
            idProduto.textContent = elemento.id;
            separa2.appendChild(idProduto);

            const separa3 = document.createElement('div');
            separa3.classList.add('div-direita');
            separa3.classList.add('div-cem');
            flex.appendChild(separa3);

            //Quantidade do produto
            const qtdProduto = document.createElement('p');
            qtdProduto.textContent = elemento.quantity;
            if (qtdProduto.textContent > 1) {
                qtdProduto.textContent = elemento.quantity + ' ' +
                    'itens'
            } else {
                qtdProduto.textContent = elemento.quantity + ' ' +
                    'item'
            }

            separa3.appendChild(qtdProduto);

            //Preço do produto
            const precoProduto = document.createElement('p');
            precoProduto.textContent = elemento.price;
            precoProduto.textContent = formatReal(precoProduto
                .textContent) + ' ' + moeda
            separa3.appendChild(precoProduto);

            const linha = document.createElement('hr')
            pedidos.append(linha);
        })

        const pai = document.querySelector('.pai');

        const flex = document.createElement('div');
        pai.appendChild(flex);

        const totais = result.totals;

        //Desconto
        const precoDesconto = document.createElement('div');
        precoDesconto.classList.add('flex2');
        flex.appendChild(precoDesconto);

        const descontoTitulo = document.createElement('h6');
        descontoTitulo.textContent = 'Total de desconto';
        precoDesconto.appendChild(descontoTitulo);

        const desconto = document.createElement('p');
        desconto.textContent = totais[1].value;
        desconto.textContent = formatReal(desconto.textContent)
        precoDesconto.appendChild(desconto);

        //Frete
        const precoFrete = document.createElement('div');
        precoFrete.classList.add('flex2');
        flex.appendChild(precoFrete);

        const freteTitulo = document.createElement('h6');
        freteTitulo.textContent = 'Total de frete';
        precoFrete.appendChild(freteTitulo);

        const frete = document.createElement('p');
        frete.textContent = totais[2].value;
        frete.textContent = formatReal(frete.textContent)
        precoFrete.appendChild(frete);

        //Taxa
        const precoTaxa = document.createElement('div');
        precoTaxa.classList.add('flex2');
        flex.appendChild(precoTaxa);

        const taxaTitulo = document.createElement('h6');
        taxaTitulo.textContent = 'Total de taxa';
        precoTaxa.appendChild(taxaTitulo);

        const taxa = document.createElement('p');
        taxa.textContent = totais[3].value;
        taxa.textContent = formatReal(taxa.textContent)
        precoTaxa.appendChild(taxa);

        const pulaLinha = document.createElement('br');
        flex.appendChild(pulaLinha);

        //Total
        const precoTotal = document.createElement('div');
        precoTotal.classList.add('flex2');
        flex.appendChild(precoTotal);

        const totalTitulo = document.createElement('h6');
        totalTitulo.textContent = 'Total dos itens';
        precoTotal.appendChild(totalTitulo);

        const total = document.createElement('p');
        total.textContent = result.value;
        total.textContent = formatReal(total.textContent)
        precoTotal.appendChild(total);

        const tipoMoeda = document.createElement('div');
        tipoMoeda.classList.add('flex2');
        flex.appendChild(tipoMoeda);

        const vazio = document.createElement('h6');
        vazio.textContent = ' '
        tipoMoeda.appendChild(vazio);

        const moedaTotal = document.createElement('p');
        moedaTotal.textContent = moeda;
        tipoMoeda.appendChild(moedaTotal);

        //Entrega
        const entrega = document.createElement('h5');
        entrega.textContent = 'Forma de entrega';
        pai.appendChild(entrega);

        const logistica = result.shippingData.logisticsInfo;

        //Tipo de entrega
        const tipoEntrega = document.createElement('p');
        tipoEntrega.textContent = logistica[0].selectedSla;
        pai.appendChild(tipoEntrega);

        //Data entrega
        const dataEntrega = document.createElement('p');
        dataEntrega.textContent = logistica[0].shippingEstimateDate;
        dataEntrega.classList.add('data');

        const novaDataEntrega = dataEntrega.textContent.split('T');
        const apenasData = novaDataEntrega[0];
        const apenasDataConvertida = convertDate(apenasData);

        const apenasHora = novaDataEntrega[1];
        const apenasHoraConvertida = apenasHora.slice(0, 5);

        dataEntrega.textContent = 'Estimado: ' + apenasDataConvertida + ' ' +
            apenasHoraConvertida;

        pai.appendChild(dataEntrega);

        //Forma entrega
        const formaEntrega = document.createElement('p');
        formaEntrega.textContent = logistica[0].deliveryCompany;
        pai.appendChild(formaEntrega);

    }).catch(error => {
        console.log(error);
    });
};

//Tentativa de requisição Zoho Desk
//Zoho Desk Request attempt
const sampleRequestObj = {
    url: "https://desk.zoho.com/api/v1/installedExtensions/{{installationId}}/configParams",
    OAuth: {
        "scope": "Desk.extensions.CREATE"
    },
    type: "POST",
    headers: {
        "orgId": 781380854,
        "Content-Type": "application/json"
    },
    requestBody: [{
            "name": "nomeLoja",
            "type": "text",
            "value": "",
            "is_secure": true
        },
        {
            "name": "apiKey",
            "type": "text",
            "value": "",
            "is_secure": true
        },
        {
            "name": "apiToken",
            "type": "text",
            "value": "",
            "is_secure": true
        }
    ]
}

window.onload = function () {
    ZOHODESK.extension.onload().then(function (App) {
        console.log("Foi");
        //Get ticket related data
        ZOHODESK.get(sampleRequestObj).then(function (res) {
            console.log(res);
        }).catch(function (err) {
            //error Handling
        });

        //To Set data in Desk UI Client
        ZOHODESK.set('ticket.comment', {
            'content': "Test comment"
        }).then(function (res) {
            //response Handling
        }).catch(function (err) {
            //error Handling
        });

        //Access Data Storage for an extension
        //Get the saved data of an extension from data storage
        ZOHODESK.get('database', {
            'key': 'key1',
            'queriableValue': 'value1'
        }).then(function (response) {
            //response Handling
        }).catch(function (err) {
            //error Handling
        })

        //Save data in to data staorage
        ZOHODESK.set('database', {
            'key': 'key_1',
            'value': {
                'id': 123
            },
            'queriableValue': 'value1'
        }).then(function (response) {
            //response Handling
        }).catch(function (err) {
            //error Handling
        })

        //Change tabs in ticket detailview
        ZOHODESK.invoke('ROUTE_TO', 'ticket.attachments');

        //To Insert the content in the current opened reply editor from extension
        ZOHODESK.invoke('Insert', 'ticket.replyEditor', {
            content: "<p>your content</p>"
        });

        //To listen to an event in desk
        App.instance.on('comment_Added', function (data) {
            //data handling 
        });

        //To access locale
        App.locale;

        //To access localresources
        App.localeResource

        //To Know more on these, please read the documentation

    });
};