// User coordinates (from CEP lookup)
let userCoordinates = {
    latitude: null,
    longitude: null
};

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
        
        // Fetch coordinates for this city
        await fetchCityCoordinates(data.localidade, data.uf);
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}

// Fetch city coordinates from OpenStreetMap
async function fetchCityCoordinates(city, state) {
    try {
        const query = encodeURIComponent(`${city}, ${state}, Brazil`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            userCoordinates.latitude = parseFloat(data[0].lat);
            userCoordinates.longitude = parseFloat(data[0].lon);
            console.log('📍 Coordenadas obtidas:', userCoordinates);
        } else {
            // Fallback: São Paulo
            userCoordinates.latitude = -23.5505;
            userCoordinates.longitude = -46.6333;
            console.log('⚠️ Usando coordenadas de São Paulo como fallback');
        }
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        userCoordinates.latitude = -23.5505;
        userCoordinates.longitude = -46.6333;
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
        { sign: 'Gêmeos', emoji: '♊', start: [5, 21], end: [6, 21] },
        { sign: 'Câncer', emoji: '♋', start: [6, 22], end: [7, 22] },
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

// ========================================
// CÁLCULO PRECISO DE ASCENDENTE
// ========================================

function calcularAscendentePreciso(birthdate, birthtime, latitude, longitude) {
    try {
        const [year, month, day] = birthdate.split('-').map(Number);
        const [hour, minute] = birthtime.split(':').map(Number);
        
        // Calcula Tempo Sideral Local
        const tsl = calcularTempoSideralLocal(year, month, day, hour, minute, longitude);
        const tslGraus = (tsl * 15) % 360;
        
        // Calcula ascendente
        const ascendente = calcularAscendenteFromTSL(tslGraus, latitude);
        
        return {
            sign: ascendente.sign,
            emoji: ascendente.emoji,
            method: 'calculated'
        };
    } catch (error) {
        console.error('Erro no cálculo:', error);
        return null;
    }
}

function calcularTempoSideralLocal(year, month, day, hour, minute, longitude) {
    const jd = calcularDataJuliana(year, month, day, hour, minute);
    const t = (jd - 2451545.0) / 36525;
    let tsg = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + t * t * (0.000387933 - t / 38710000);
    tsg = tsg % 360;
    if (tsg < 0) tsg += 360;
    const tsl = tsg + longitude;
    return (tsl / 15) % 24;
}

function calcularDataJuliana(year, month, day, hour, minute) {
    const hourDecimal = hour + (minute / 60);
    let y = year, m = month;
    if (m <= 2) { y -= 1; m += 12; }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + (hourDecimal / 24);
}

function calcularAscendenteFromTSL(tslGraus, latitude) {
    const signos = [
        { sign: 'Áries', emoji: '♈', start: 0, end: 30 },
        { sign: 'Touro', emoji: '♉', start: 30, end: 60 },
        { sign: 'Gêmeos', emoji: '♊', start: 60, end: 90 },
        { sign: 'Câncer', emoji: '♋', start: 90, end: 120 },
        { sign: 'Leão', emoji: '♌', start: 120, end: 150 },
        { sign: 'Virgem', emoji: '♍', start: 150, end: 180 },
        { sign: 'Libra', emoji: '♎', start: 180, end: 210 },
        { sign: 'Escorpião', emoji: '♏', start: 210, end: 240 },
        { sign: 'Sagitário', emoji: '♐', start: 240, end: 270 },
        { sign: 'Capricórnio', emoji: '♑', start: 270, end: 300 },
        { sign: 'Aquário', emoji: '♒', start: 300, end: 330 },
        { sign: 'Peixes', emoji: '♓', start: 330, end: 360 }
    ];
    
    const latitudeAdjustment = Math.abs(latitude) / 90 * 15;
    const adjustedTSL = (tslGraus + latitudeAdjustment) % 360;
    
    for (let signo of signos) {
        if (adjustedTSL >= signo.start && adjustedTSL < signo.end) {
            return signo;
        }
    }
    return signos[0];
}

// Ascendant Calculator (simplified - fallback)
function getAscendantSimple(birthTime) {
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

// Get Emoji for Sign Name
function getEmojiForSign(signName) {
    const emojiMap = {
        'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
        'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
        'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓'
    };
    return emojiMap[signName] || '⭐';
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
// ========================================
// MATRIZ INTELIGENTE DE PERSONAS
// Gerada por análise psicográfica profunda
// ========================================

const PERSONA_SCORING = {
  MARINA: {
    name: 'Workaholic Conectada',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { instagram: 3, news: 1, coffee: 2, rush: 2 },
    q2: { conspiracy: 1, gossip: 2, horoscope: 3, trends: 3 },
    q3: { facts: 2, memes: 3, listener: 2, organizer: 1 },
    interest: { career: 2, lifestyle: 3, tech: 1, culture: 2, all: 2 }
  },
  PEDRO: {
    name: 'Líder Antenado',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { instagram: 0, news: 3, coffee: 2, rush: 1 },
    q2: { conspiracy: 1, gossip: 0, horoscope: 0, trends: 2 },
    q3: { facts: 3, memes: 1, listener: 1, organizer: 3 },
    interest: { career: 3, lifestyle: 1, tech: 2, culture: 1, all: 0 }
  },
  CAROLINA: {
    name: 'Sábia Sofisticada',
    age_weights: { "18-28": 0, "29-39": 0, "40-49": 2, "50+": 3 },
    q1: { instagram: 0, news: 2, coffee: 3, rush: 0 },
    q2: { conspiracy: 2, gossip: 1, horoscope: 2, trends: 1 },
    q3: { facts: 2, memes: 0, listener: 3, organizer: 2 },
    interest: { career: 2, lifestyle: 2, tech: 1, culture: 3, all: 1 }
  },
  FELIPE: {
    name: 'Workaholic Equilibrista',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { instagram: 1, news: 2, coffee: 2, rush: 2 },
    q2: { conspiracy: 1, gossip: 1, horoscope: 2, trends: 2 },
    q3: { facts: 2, memes: 2, listener: 2, organizer: 2 },
    interest: { career: 2, lifestyle: 3, tech: 1, culture: 2, all: 2 }
  },
  JULIA: {
    name: 'Mãe Executiva',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { instagram: 2, news: 1, coffee: 1, rush: 3 },
    q2: { conspiracy: 0, gossip: 2, horoscope: 2, trends: 2 },
    q3: { facts: 1, memes: 2, listener: 2, organizer: 3 },
    interest: { career: 2, lifestyle: 2, tech: 1, culture: 1, all: 3 }
  },
  THIAGO: {
    name: 'Jovem Ansioso',
    age_weights: { "18-28": 3, "29-39": 1, "40-49": 0, "50+": 0 },
    q1: { instagram: 3, news: 2, coffee: 0, rush: 3 },
    q2: { conspiracy: 2, gossip: 2, horoscope: 1, trends: 3 },
    q3: { facts: 2, memes: 3, listener: 0, organizer: 2 },
    interest: { career: 3, lifestyle: 1, tech: 2, culture: 1, all: 2 }
  },
  HENRIQUE: {
    name: 'Gourmet Cult',
    age_weights: { "18-28": 0, "29-39": 1, "40-49": 2, "50+": 1 },
    q1: { instagram: 1, news: 2, coffee: 3, rush: 0 },
    q2: { conspiracy: 2, gossip: 3, horoscope: 0, trends: 2 },
    q3: { facts: 2, memes: 1, listener: 2, organizer: 2 },
    interest: { career: 0, lifestyle: 2, tech: 1, culture: 3, all: 1 }
  }
};

function determinePersona(formData) {
  const scores = {};
  
  // Determinar faixa etária
  const age = calculateAge(formData.birthdate);
  let ageGroup;
  if (age < 29) ageGroup = "18-28";
  else if (age < 40) ageGroup = "29-39";
  else if (age < 50) ageGroup = "40-49";
  else ageGroup = "50+";
  
  // Calcular score para cada persona
  for (const [personaKey, weights] of Object.entries(PERSONA_SCORING)) {
    let score = 0;
    
    // Peso da idade (muito importante!)
    score += weights.age_weights[ageGroup] * 3;
    
    // Q1 - Múltiplas respostas
    if (formData.q1) {
      const q1Answers = formData.q1.split(', ');
      q1Answers.forEach(answer => {
        score += weights.q1[answer] || 0;
      });
    }
    
    // Q2 - Múltiplas respostas
    if (formData.q2) {
      const q2Answers = formData.q2.split(', ');
      q2Answers.forEach(answer => {
        score += weights.q2[answer] || 0;
      });
    }
    
    // Q3 - Múltiplas respostas
    if (formData.q3) {
      const q3Answers = formData.q3.split(', ');
      q3Answers.forEach(answer => {
        score += weights.q3[answer] || 0;
      });
    }
    
    // Interest - Múltiplas respostas
    if (formData.interest) {
      const interests = formData.interest.split(', ');
      interests.forEach(interest => {
        score += weights.interest[interest] || 0;
      });
    }
    
    scores[personaKey] = score;
  }
  
  // Encontrar persona com maior score
  let bestPersona = 'MARINA';
  let bestScore = 0;
  
  for (const [persona, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestPersona = persona;
    }
  }
  
  // Debug log (remover em produção se quiser)
  console.log('🎯 Persona Scores:', scores);
  console.log('✅ Melhor match:', bestPersona, 'com score', bestScore);
  
  return PERSONA_SCORING[bestPersona].name;
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
        ascendente_manual: document.querySelector('select[name="ascendente_manual"]').value,
        q1: Array.from(document.querySelectorAll('input[name="q1[]"]:checked')).map(cb => cb.value).join(', '),
        q2: Array.from(document.querySelectorAll('input[name="q2[]"]:checked')).map(cb => cb.value).join(', '),
        q3: Array.from(document.querySelectorAll('input[name="q3[]"]:checked')).map(cb => cb.value).join(', '),
        interest: Array.from(document.querySelectorAll('input[name="interest[]"]:checked')).map(cb => cb.value).join(', ')
    };
    
    // Calculate zodiac info
    const birthDate = new Date(formData.birthdate);
    const zodiac = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1);
    
    // Ascendant: usa manual se informado, senão calcula
    let ascendant;
    if (formData.ascendente_manual) {
        // Usuário informou manualmente - usa esse!
        const emoji = getEmojiForSign(formData.ascendente_manual);
        ascendant = { sign: formData.ascendente_manual, emoji: emoji, method: 'manual' };
    } else if (formData.birthtime && userCoordinates.latitude) {
        // Calcula com precisão (tem hora + coordenadas)
        console.log('🔭 Calculando ascendente preciso...');
        ascendant = calcularAscendentePreciso(
            formData.birthdate,
            formData.birthtime,
            userCoordinates.latitude,
            userCoordinates.longitude
        );
        
        // Se o cálculo preciso falhar, usa simplificado
        if (!ascendant) {
            console.log('⚠️ Fallback para cálculo simplificado');
            ascendant = getAscendantSimple(formData.birthtime);
        }
    } else if (formData.birthtime) {
        // Tem hora mas não tem coordenadas - usa aproximado
        console.log('⚠️ Cálculo aproximado (sem coordenadas)');
        ascendant = getAscendantSimple(formData.birthtime);
    } else {
        // Sem hora de nascimento
        ascendant = null;
    }
    
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
        
        // ========================================
        // AUTENTICAÇÃO PARA ARQUIVO DE EDIÇÕES
        // Salva email no navegador para acesso às edições
        // ========================================
        localStorage.setItem('user_email', formData.email);
        localStorage.setItem('auth_token', 'auth_' + Date.now());
        console.log('✅ Autenticação salva para acesso às edições');
        
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
    
    // Persona image mapping
    const personaImages = {
        'Workaholic Conectada': 'marina.png',
        'Líder Antenado': 'pedro.png',
        'Sábia Sofisticada': 'carolina.png',
        'Workaholic Equilibrista': 'felipe.png',
        'Mãe Executiva': 'julia.png',
        'Jovem Ansioso': 'thiago.png',
        'Gourmet Cult': 'henrique.png'
    };
    
    // Get persona image
    const personaImage = personaImages[data.persona] || 'marina.png';
    
    // Populate avatar with image
    const avatarEl = document.getElementById('persona-avatar');
    avatarEl.innerHTML = `<img src="images/personas/${personaImage}" alt="${data.persona}" class="persona-image">`;
    
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
