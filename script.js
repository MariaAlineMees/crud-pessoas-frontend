const lista = document.getElementById('lista-pessoas');
const form = document.getElementById('form-pessoa');
const nomeInput = document.getElementById('nome');
const idadeInput = document.getElementById('idade');
const idInput = document.getElementById('idPessoa');

// Carrega a lista de pessoas
function carregarPessoas() {
  fetch('http://localhost:3000/pessoas')
    .then(res => res.json())
    .then(vetor => {
      lista.innerHTML = '';
      vetor.forEach(pessoa => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
          <span>Nome: ${pessoa.nome} | Idade: ${pessoa.idade}</span>
          <div>
            <button class="btn btn-sm btn-warning me-2" onclick="editarPessoa(${pessoa.id}, '${pessoa.nome}', ${pessoa.idade})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="excluirPessoa(${pessoa.id})">Excluir</button>
          </div>
        `;
        lista.appendChild(item);
      });
    })
    .catch(erro => console.error('Erro ao carregar pessoas:', erro));
}

// Envia o formulário para criar ou atualizar pessoa
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = nomeInput.value;
  const idade = parseInt(idadeInput.value);
  const id = idInput.value;

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `http://localhost:3000/pessoas/${id}` : 'http://localhost:3000/pessoas';

  fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, idade })
  })
  .then(res => res.json())
  .then(() => {
    form.reset();
    idInput.value = '';
    carregarPessoas();
  })
  .catch(erro => console.error('Erro ao salvar pessoa:', erro));
});

// Preenche o formulário com os dados da pessoa para edição
function editarPessoa(id, nome, idade) {
  idInput.value = id;
  nomeInput.value = nome;
  idadeInput.value = idade;
}

// Exclui uma pessoa
function excluirPessoa(id) {
  if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
    fetch(`http://localhost:3000/pessoas/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => carregarPessoas())
    .catch(erro => console.error('Erro ao excluir pessoa:', erro));
  }
}

// Carrega a lista ao iniciar
carregarPessoas();