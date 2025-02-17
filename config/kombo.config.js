
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

    // Função para carregar os dados dos alunos
    function fetchAlunosData() {
      return new Promise((resolve) => {
        onValue(alunosRef, (snapshot) => {
          const alunos = [];
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            data.id = childSnapshot.key;
            alunos.push(data);
          });
          resolve(alunos);
        });
      });
    }

    // Função para criar o gráfico de distribuição de classes
    async function createClassesChart(classes) {
      if (!document.getElementById('classesChart')) {
        return;
      }

      const labels = Object.keys(classes);
      const dataValues = Object.values(classes);

      const data = {
        labels: labels,
        datasets: [{
          label: 'Distribuição de Alunos por Classe',
          data: dataValues,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',  // Vermelho desaturado
            'rgba(75, 192, 192, 0.6)',  // Verde desaturado
            'rgba(255, 205, 86, 0.6)',  // Amarelo desaturado
            'rgba(201, 203, 207, 0.6)', // Cinza desaturado
            'rgba(54, 162, 235, 0.6)'   // Azul desaturado
          ]
        }]
      };

      const config = {
        type: 'polarArea',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      };

      const ctx = document.getElementById('classesChart').getContext('2d');
      new Chart(ctx, config);
    }

    // Função para criar o gráfico combinado
    async function createCombinedChart(alunos) {
      if (!document.getElementById('combinedChart')) {
        console.error('Elemento #combinedChart não encontrado.');
        return;
      }

      const classes = {};
      const turmas = {};
      const periodos = {};

      alunos.forEach((aluno) => {
        if (aluno.classe) classes[aluno.classe] = (classes[aluno.classe] || 0) + 1;
        if (aluno.turma) turmas[aluno.turma] = (turmas[aluno.turma] || 0) + 1;
        if (aluno.periodo) periodos[aluno.periodo] = (periodos[aluno.periodo] || 0) + 1;
      });

      const allKeys = [...new Set([...Object.keys(classes), ...Object.keys(turmas), ...Object.keys(periodos)])];
      const classValues = allKeys.map(key => classes[key] || 0);
      const turmaValues = allKeys.map(key => turmas[key] || 0);
      const periodoValues = allKeys.map(key => periodos[key] || 0);

      const data = {
        labels: allKeys,
        datasets: [
          {
            label: 'Classes',
            data: classValues,
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Vermelho desaturado
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Turmas',
            data: turmaValues,
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Verde desaturado
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Períodos',
            data: periodoValues,
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Azul desaturado
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };

      const config = {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: true
            },
            y: {
              beginAtZero: true,
              stacked: true
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      };

      const combinedCtx = document.getElementById('combinedChart').getContext('2d');
      new Chart(combinedCtx, config);
    }

    // Inicialização dos gráficos
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const alunos = await fetchAlunosData();

        if (alunos.length === 0) {
          alert('Nenhum aluno cadastrado no sistema.');
          return;
        }

        // Criar gráfico de classes
        const classes = {};
        alunos.forEach((aluno) => {
          if (aluno.classe) classes[aluno.classe] = (classes[aluno.classe] || 0) + 1;
        });
        createClassesChart(classes);

        // Criar gráfico combinado
        createCombinedChart(alunos);
      } catch (error) {
        console.error('Erro ao carregar os gráficos:', error);
        alert('Ocorreu um erro ao carregar os gráficos.');
      }
    });