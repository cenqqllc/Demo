// Função para inicializar a validação do campo "Código"
function initializeCodigoValidation() {
    const codigoInput = document.getElementById('codigo');
    if (codigoInput) {
        // Adiciona o evento de validação
        codigoInput.addEventListener('input', function (event) {
            const input = event.target;
            const value = input.value;

            // Variável para construir o novo valor válido
            let newValue = '';
            let isValid = true;

            // Percorre cada caractere do valor atual do campo
            for (let i = 0; i < value.length; i++) {
                const char = value[i];

                if (i < 9 && !isNaN(char)) { // Os primeiros 9 caracteres devem ser números
                    newValue += char;
                } else if (i >= 9 && i <= 10 && /[A-Z]/.test(char)) { // Caracteres 10 e 11 devem ser letras maiúsculas
                    newValue += char;
                } else if (i >= 11 && i <= 13 && !isNaN(char)) { // Caracteres 12, 13 e 14 devem ser números
                    newValue += char;
                } else {
                    isValid = false; // Marca como inválido se algum caractere não atender às regras
                }
            }

            // Limita o comprimento do campo a 14 caracteres
            if (newValue.length > 14) {
                newValue = newValue.slice(0, 14);
            }

            // Atualiza o valor do campo com os caracteres válidos
            input.value = newValue;

            // Adiciona ou remove a classe 'invalid' dependendo da validade
            if (!isValid || newValue.length !== value.length) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
    }