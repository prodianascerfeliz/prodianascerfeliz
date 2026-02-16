// Scroll to Quiz from Hero CTA
function scrollToQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    const offset = quizContainer.offsetTop - 100;
    window.scrollTo({ top: offset, behavior: 'smooth' });
}

// Start Quiz from CTA
function startQuiz() {
    document.querySelector('.cta-section').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('q1').classList.add('active');
    window.scrollTo({ top: document.getElementById('quiz-container').offsetTop - 100, behavior: 'smooth' });
}

// CEP Auto-fill
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    
    if (cepInput) {
        // Format CEP while typing
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5, 8);
            }
            e.target.value = value;
            
            // Auto-search when complete
            if (value.length === 9) {
                searchCEP(value);
            }
        });
    }
});

async function searchCEP(cep) {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) return;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado. Verifique e tente novamente.');
            return;
        }
        
        // Fill city field
        const cityInput = document.getElementById('city');
        cityInput.value = `${data.localidade} - ${data.uf}`;
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}

// Quiz Navigation
function nextQuestion(questionNumber) {
    // Validate current question
    const currentQuestion = document.querySelector('.quiz-question.active');
    const inputs = currentQuestion.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (input.type === 'radio') {
            const radioGroup = currentQuestion.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) isValid = false;
        } else {
            if (!input.value.trim()) isValid = false;
        }
    });

    if (!isValid) {
        alert('Por favor, preencha todos os campos antes de continuar.');
        return;
    }

    // Hide current and show next
    currentQuestion.classList.remove('active');
    document.getElementById(`q${questionNumber}`).classList.add('active');
    
    // Scroll to quiz container (not top of page)
    const quizContainer = document.getElementById('quiz-container');
    const offset = quizContainer.offsetTop - 100; // 100px de margem do topo
    window.scrollTo({ top: offset, behavior: 'smooth' });
}

function prevQuestion(questionNumber) {
    document.querySelector('.quiz-question.active').classList.remove('active');
    document.getElementById(`q${questionNumber}`).classList.add('active');
    
    // Scroll to quiz container
    const quizContainer = document.getElementById('quiz-container');
    const offset = quizContainer.offsetTop - 100;
    window.scrollTo({ top: offset, behavior: 'smooth' });
}

// Zodiac Sign Calculator
function getZodiacSign(day, month) {
    const zodiacSigns = [
        { sign: 'Capricórnio', emoji: '♑', start: [12, 22], end: [1, 19] },
        { sign: 'Aquário', emoji: '♒', start: [1, 20], end: [2, 18] },
        { sign: 'Peixes', emoji: '♓', start: [2, 19], end: [3, 20] },
        { sign: 'Áries', emoji: '♈', start: [3, 21], end: [4, 19] },
        { sign: 'Touro', emoji: '♉', start: [4, 20], end: [5, 20] },
        { sign: 'Gêmeos', emoji: '♊', start: [5, 21], end: [6, 20] },
        { sign: 'Câncer', emoji: '♋', start: [6, 21], end: [7, 22] },
        { sign: 'Leão', emoji: '♌', start: [7, 23], end: [8, 22] },
        { sign: 'Virgem', emoji: '♍', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
        { sign: 'Escorpião', emoji: '♏', start: [10, 23], end: [11, 21] },
        { sign: 'Sagitário', emoji: '♐', start: [11, 22], end: [12, 21] }
    ];

    for (let z of zodiacSigns) {
        if ((month === z.start[0] && day >= z.start[1]) || 
            (month === z.end[0] && day <= z.end[1])) {
            return { sign: z.sign, emoji: z.emoji };
        }
    }
    return { sign: 'Capricórnio', emoji: '♑' };
}

// Ascendant Calculator (simplified - based on birth time)
function getAscendant(birthTime) {
    if (!birthTime) return null;
    
    const [hours, minutes] = birthTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    const ascendants = [
        { sign: 'Áries', emoji: '♈', start: 0, end: 120 },
        { sign: 'Touro', emoji: '♉', start: 120, end: 240 },
        { sign: 'Gêmeos', emoji: '♊', start: 240, end: 360 },
        { sign: 'Câncer', emoji: '♋', start: 360, end: 480 },
        { sign: 'Leão', emoji: '♌', start: 480, end: 600 },
        { sign: 'Virgem', emoji: '♍', start: 600, end: 720 },
        { sign: 'Libra', emoji: '♎', start: 720, end: 840 },
        { sign: 'Escorpião', emoji: '♏', start: 840, end: 960 },
        { sign: 'Sagitário', emoji: '♐', start: 960, end: 1080 },
        { sign: 'Capricórnio', emoji: '♑', start: 1080, end: 1200 },
        { sign: 'Aquário', emoji: '♒', start: 1200, end: 1320 },
        { sign: 'Peixes', emoji: '♓', start: 1320, end: 1440 }
    ];
    
    for (let asc of ascendants) {
        if (totalMinutes >= asc.start && totalMinutes < asc.end) {
            return { sign: asc.sign, emoji: asc.emoji };
        }
    }
    return { sign: 'Áries', emoji: '♈' };
}

// Calculate Age
function calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Determine Persona
function determinePersona(formData) {
    const age = calculateAge(formData.birthdate);
    
    // Simplified persona logic
    if (age >= 45) {
        return 'Carolina (Sábia Sofisticada)';
    } else if (formData.q1 === 'news' || formData.interest === 'career') {
        return 'Pedro (Líder Antenado)';
    } else {
        return 'Marina (Workaholic Conectada)';
    }
}

// Form Submission
document.getElementById('quiz-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.querySelector('input[name="name"]').value,
        email: document.querySelector('input[name="email"]').value,
        cep: document.querySelector('input[name="cep"]').value,
        city: document.querySelector('input[name="city"]').value,
        birthdate: document.querySelector('input[name="birthdate"]').value,
        birthtime: document.querySelector('input[name="birthtime"]').value,
        q1: document.querySelector('input[name="q1"]:checked').value,
        q2: document.querySelector('input[name="q2"]:checked').value,
        q3: document.querySelector('input[name="q3"]:checked').value,
        interest: document.querySelector('input[name="interest"]:checked').value
    };
    
    // Calculate zodiac info
    const birthDate = new Date(formData.birthdate);
    const zodiac = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1);
    const ascendant = getAscendant(formData.birthtime);
    const age = calculateAge(formData.birthdate);
    const persona = determinePersona(formData);
    
    // Prepare data to send
    const submitData = {
        ...formData,
        zodiac_sign: zodiac.sign,
        zodiac_emoji: zodiac.emoji,
        ascendant: ascendant ? ascendant.sign : '',
        ascendant_emoji: ascendant ? ascendant.emoji : '',
        age: age,
        persona: persona,
        timestamp: new Date().toISOString()
    };
    
    console.log('Enviando para Google Sheets:', submitData);
    
    try {
        // Enviar para Google Sheets via sua API
        await sendToGoogleSheets(submitData);
        
        // Show success message
        showSuccess(submitData, zodiac, ascendant);
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('Ops! Algo deu errado. Tente novamente em alguns segundos.');
    }
});

// Show Success Message
function showSuccess(data, zodiac, ascendant) {
    document.getElementById('quiz-form').style.display = 'none';
    
    const successMessage = document.getElementById('success-message');
    const resultText = document.getElementById('result-text');
    
    let message = `Olá, ${data.name}! Você é ${zodiac.emoji} ${zodiac.sign}`;
    if (ascendant) {
        message += ` com ascendente em ${ascendant.emoji} ${ascendant.sign}`;
    }
    message += '.';
    
    resultText.textContent = message;
    successMessage.style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Send to Google Sheets via Apps Script Web App
async function sendToGoogleSheets(data) {
    // URL do Google Apps Script Web App
    const scriptUrl = 'https://script.google.com/macros/s/AKfycby5HS21FNsOw8T66p7_Y2TDcUNW4N_4FM6cK5pfQ-vJ8yFQ4JnhyWchIJTSPHYqmA/exec';
    
    const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Necessário para Apps Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    // Com no-cors, não conseguimos verificar a resposta
    // Mas se não der erro, significa que foi enviado
    console.log('✅ Dados enviados para Google Sheets');
    return true;
}
