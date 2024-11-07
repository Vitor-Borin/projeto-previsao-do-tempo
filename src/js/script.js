const chaveDaApi = "3d783118e6fa4ef882711235240711";

const botaoDeBusca = document.querySelector(".btn-busca");
const inputBusca = document.getElementById("input-busca");
const listaSugestoes = document.querySelector(".lista-sugestoes");

botaoDeBusca.addEventListener("click", async () => {
  const cidade = inputBusca.value;
  if (!cidade) return;

  const dados = await buscarDadosDaCidade(cidade);
  if (dados) preencherDadosNaTela(dados, cidade);
});

async function buscarDadosDaCidade(cidade) {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${chaveDaApi}&q=${cidade}&aqi=no&lang=pt`;
  const resposta = await fetch(apiUrl);

  if (resposta.status !== 200) return;

  const dados = await resposta.json();
  return dados;
}

function preencherDadosNaTela(dados, cidade) {
  const temperatura = Math.round(dados.current.temp_c);
  const condicao = dados.current.condition.text;
  const umidade = dados.current.humidity;
  const velocidadeDoVento = dados.current.wind_kph;
  const iconeCondicao = dados.current.condition.icon;

  document.getElementById("cidade").textContent = cidade;
  document.getElementById("temperatura").textContent = `${temperatura} ºC`;
  document.getElementById("condicao").textContent = condicao;
  document.getElementById("umidade").textContent = `${umidade}%`;
  document.getElementById("velocidade-do-vento").textContent = `${velocidadeDoVento} km/h`;
  document.getElementById("icone-condicao").setAttribute("src", iconeCondicao);
}

async function buscarSugestoesDeCidade(query) {
  const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${chaveDaApi}&q=${query}`;
  const resposta = await fetch(apiUrl);
  if (resposta.status !== 200) return [];

  const sugestoes = await resposta.json();
  return sugestoes;
}

inputBusca.addEventListener("input", async () => {
  const query = inputBusca.value;
  if (query.length < 3) {
    limparSugestoes();
    return;
  }

  const sugestoes = await buscarSugestoesDeCidade(query);
  mostrarSugestoes(sugestoes);
});

function mostrarSugestoes(sugestoes) {
  limparSugestoes();

  sugestoes.forEach((sugestao) => {
    const item = document.createElement("li");
    item.textContent = sugestao.name;
    item.addEventListener("click", () => {
      inputBusca.value = sugestao.name;
      limparSugestoes();
    });
    listaSugestoes.appendChild(item);
  });
}

function limparSugestoes() {
  listaSugestoes.innerHTML = "";
}