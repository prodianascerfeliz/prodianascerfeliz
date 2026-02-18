// Scroll to Quiz from Hero CTA
function scrollToQuiz() {
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const offset = ctaSection.offsetTop - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
}

// Phone auto-format
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('field-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 6) {
                value = value.slice(0,2) + ' ' + value.slice(2,7) + '-' + value.slice(7);
            } else if (value.length > 2) {
                value = value.slice(0,2) + ' ' + value.slice(2);
            }
            e.target.value = value;
        });
    }
});

// Validate Q4 and proceed to Q5
function validateAndNext() {
    let isValid = true;

    // Clear all previous errors
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    // Name
    const name = document.getElementById('field-name');
    if (!name.value.trim() || name.value.trim().length < 2) {
        showError('error-name', 'Por favor, informe seu nome completo.');
        name.classList.add('input-error');
        isValid = false;
    }

    // Email
    const email = document.getElementById('field-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        showError('error-email', 'Por favor, informe um email válido.');
        email.classList.add('input-error');
        isValid = false;
    }

    // Phone
    const phone = document.getElementById('field-phone');
    const phoneClean = phone.value.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
        showError('error-phone', 'Por favor, informe um celular válido com DDD.');
        phone.classList.add('input-error');
        isValid = false;
    }

    // CEP
    const cep = document.getElementById('cep');
    const cepClean = cep.value.replace(/\D/g, '');
    if (cepClean.length !== 8) {
        showError('error-cep', 'Por favor, informe um CEP válido.');
        cep.classList.add('input-error');
        isValid = false;
    }

    // Birthdate - 18+
    const birthdate = document.getElementById('field-birthdate');
    if (!birthdate.value) {
        showError('error-birthdate', 'Por favor, informe sua data de nascimento.');
        birthdate.classList.add('input-error');
        isValid = false;
    } else {
        const birth = new Date(birthdate.value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 18) {
            showError('error-birthdate', 'Cadastro permitido somente para maiores de 18 anos.');
            birthdate.classList.add('input-error');
            isValid = false;
        }
    }

    // Newsletter opt-in
    const acceptNewsletter = document.getElementById('accept_newsletter');
    if (!acceptNewsletter.checked) {
        showError('error-newsletter', 'É necessário aceitar o recebimento da newsletter para continuar.');
        isValid = false;
    }

    // Privacy opt-in
    const acceptPrivacy = document.getElementById('accept_privacy');
    if (!acceptPrivacy.checked) {
        showError('error-privacy', 'É necessário aceitar a Política de Privacidade para continuar.');
        isValid = false;
    }

    // If valid, go to Q5
    if (isValid) {
        nextQuestion(5);
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.input-error, .field-error:not(:empty)');
        if (firstError) {
            window.scrollTo({ top: firstError.offsetTop - 150, behavior: 'smooth' });
        }
    }
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
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
    
    // Simplified persona logic - returns only profile
    if (age >= 45) {
        return 'Sábia Sofisticada';
    } else if (formData.q1 === 'news' || formData.interest === 'career') {
        return 'Líder Antenado';
    } else {
        return 'Workaholic Conectada';
    }
}

// Form Submission
document.getElementById('quiz-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.querySelector('input[name="name"]').value,
        email: document.querySelector('input[name="email"]').value,
        phone: document.querySelector('input[name="phone"]').value,
        cep: document.querySelector('input[name="cep"]').value,
        city: document.querySelector('input[name="city"]').value,
        birthdate: document.querySelector('input[name="birthdate"]').value,
        birthtime: document.querySelector('input[name="birthtime"]').value,
        q1: Array.from(document.querySelectorAll('input[name="q1[]"]:checked')).map(cb => cb.value).join(', '),
        q2: Array.from(document.querySelectorAll('input[name="q2[]"]:checked')).map(cb => cb.value).join(', '),
        q3: Array.from(document.querySelectorAll('input[name="q3[]"]:checked')).map(cb => cb.value).join(', '),
        interest: Array.from(document.querySelectorAll('input[name="interest[]"]:checked')).map(cb => cb.value).join(', ')
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
    
    // Persona emoji mapping
    const personaEmojis = {
        'Workaholic Conectada': '🐕',        // Golden Retriever
        'Líder Antenado': '💼',              // Briefcase
        'Sábia Sofisticada': '📚',           // Books
        'Workaholic Equilibrista': '🏄',     // Surf
        'Mãe Executiva': '🐙',               // Octopus
        'Jovem Ansioso': '⚡',                // Lightning
        'Gourmet Cult': '🍷'                 // Wine
    };
    
    // Get persona emoji
    const personaEmoji = personaEmojis[data.persona] || '⭐';
    
    // Populate avatar
    document.getElementById('persona-avatar').textContent = personaEmoji;
    
    // Populate greeting
    const firstName = data.name.split(' ')[0];
    document.getElementById('persona-greeting').innerHTML = `Olá, <strong>${firstName}!</strong>`;
    
    // Populate persona type
    document.getElementById('persona-type').textContent = `Você é ${data.persona}`;
    
    // Build zodiac text with rarity
    let zodiacText = `${zodiac.emoji} ${zodiac.sign}`;
    if (ascendant) {
        zodiacText += ` com ascendente em ${ascendant.emoji} ${ascendant.sign}`;
        zodiacText += `<span class="rarity">(sua combinação é rara — só 8% da população tem isso!)</span>`;
    }
    document.getElementById('persona-zodiac').innerHTML = zodiacText;
    
    // Build details sections
    let detailsHTML = '';
    
    // Interests
    const interestMap = {
        'career': 'Carreira e produtividade',
        'lifestyle': 'Lifestyle e bem-estar',
        'tech': 'Tech e inovação',
        'culture': 'Cultura e entretenimento',
        'all': 'Tudo misturado'
    };
    
    if (data.interest) {
        const interests = data.interest.split(', ').map(i => interestMap[i] || i);
        const interestsList = interests.map(i => `<strong>${i}</strong>`).join('<br>• ');
        detailsHTML += `
            <div class="persona-detail-section">
                <div class="detail-title"><span class="detail-icon">🎯</span> Seus interesses:</div>
                <div class="detail-content">• ${interestsList}</div>
            </div>
        `;
    }
    
    // Q1 - Como você começa o dia
    const q1Map = {
        'instagram': 'scrollando Instagram na cama',
        'news': 'lendo notícias',
        'coffee': 'tomando café em silêncio',
        'rush': 'já atrasado'
    };
    if (data.q1) {
        const q1Items = data.q1.split(', ').map(i => q1Map[i] || i);
        const q1Text = formatList(q1Items);
        detailsHTML += `
            <div class="persona-detail-section">
                <div class="detail-title"><span class="detail-icon">⚡</span> Como você é:</div>
                <div class="detail-content">${q1Text}</div>
            </div>
        `;
    }
    
    // Q2 - Guilty pleasure
    const q2Map = {
        'conspiracy': 'teorias da conspiração',
        'gossip': 'fofoca de celebridade',
        'horoscope': 'horóscopo e astrologia',
        'trends': 'trends & memes'
    };
    if (data.q2) {
        const q2Items = data.q2.split(', ').map(i => q2Map[i] || i);
        const q2Text = formatList(q2Items);
        detailsHTML += `
            <div class="persona-detail-section">
                <div class="detail-title"><span class="detail-icon">💭</span> Seu guilty pleasure:</div>
                <div class="detail-content">${q2Text}</div>
            </div>
        `;
    }
    
    // Q3 - No grupo
    const q3Map = {
        'facts': 'manda os fatos',
        'memes': 'manda os memes',
        'listener': 'é quem mais ouve',
        'organizer': 'organiza os rolês'
    };
    if (data.q3) {
        const q3Items = data.q3.split(', ').map(i => q3Map[i] || i);
        const q3Text = formatList(q3Items, true); // true = add personality comment
        detailsHTML += `
            <div class="persona-detail-section">
                <div class="detail-title"><span class="detail-icon">🌟</span> No grupo, você:</div>
                <div class="detail-content">${q3Text}</div>
            </div>
        `;
    }
    
    document.getElementById('persona-details').innerHTML = detailsHTML;
    
    successMessage.style.display = 'block';
    
    // Scroll to success message
    setTimeout(() => {
        const offset = successMessage.offsetTop - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 100);
}

// Helper function to format lists naturally
function formatList(items, addComment = false) {
    if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        const text = items.join(' e ');
        return addComment ? text + ' <em>(multitasking é seu sobrenome!)</em>' : text;
    } else {
        const last = items.pop();
        const text = items.join(', ') + ' e ' + last;
        return addComment ? text + ' <em>(a pessoa que faz acontecer!)</em>' : text;
    }
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
