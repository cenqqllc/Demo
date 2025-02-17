
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDclL0jLxf0wnPneWqSjLV7xxw0E_nUGiE",
      authDomain: "escola-secretaria.firebaseapp.com",
      databaseURL: "https://escola-secretaria-default-rtdb.firebaseio.com",
      projectId: "escola-secretaria",
      storageBucket: "escola-secretaria.firebasestorage.app",
      messagingSenderId: "574013844708",
      appId: "1:574013844708:web:eceb883af38b3d1a6cd0f1",
      measurementId: "G-C4YL6PXZFQ"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // Referência ao nó `Alunos_cadastrados`
    const alunosRef = ref(database, 'Alunos_cadastrados');
    const alunoListContainer = document.getElementById('alunoList');

    // Função para renderizar a lista de alunos
    function renderAlunoList(alunos) {
      alunoListContainer.innerHTML = '';

      if (alunos.length === 0) {
        alunoListContainer.innerHTML = '<p>Nenhum aluno inscrito.</p>';
        return;
      }

      alunos.forEach((aluno) => {
        const alunoItem = document.createElement('div');
        alunoItem.className = 'aluno-item';

        alunoItem.innerHTML = `
          <div>${aluno.nome || 'Nome não informado'}</div>
          <div>${aluno.telefone || 'Telefone não informado'}</div>
          <div>${aluno.telefoneSecundario || 'Telefone secundário não informado'}</div>
          <div>${aluno.endereco || 'Endereço não informado'}</div>
        `;

        alunoListContainer.appendChild(alunoItem);
      });
    }

    // Função para buscar todos os alunos
    function fetchAlunos() {
      onValue(alunosRef, (snapshot) => {
        const alunos = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          data.id = childSnapshot.key;
          alunos.push(data);
        });
        renderAlunoList(alunos);
      });
    }

    // Carrega a lista inicial de alunos
    fetchAlunos();