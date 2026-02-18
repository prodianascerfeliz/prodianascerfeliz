// ========================================
// MATRIZ INTELIGENTE DE PERSONAS
// Gerada por análise psicográfica profunda
// ========================================

const PERSONA_SCORING = {
  MARINA: {
    // Workaholic Conectada - 39 anos, autêntica, emocional, sem filtro
    name: 'Workaholic Conectada',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { 
      instagram: 3,  // Muito conectada digitalmente
      news: 1,       // Menos que Pedro mas ainda consome
      coffee: 2,     // Aprecia momentos de reflexão
      rush: 2        // Workaholic = sempre correndo
    },
    q2: { 
      conspiracy: 1, 
      gossip: 2,     // Gosta de conexão humana, fofoca light
      horoscope: 3,  // Emocional, intuitiva
      trends: 3      // Muito conectada, acompanha o que rola
    },
    q3: { 
      facts: 2,      // Autêntica = fala verdades
      memes: 3,      // Conectada, humor
      listener: 2,   // Emocional, sabe ouvir
      organizer: 1   // Menos organizadora
    },
    interest: { 
      career: 2,     // Workaholic
      lifestyle: 3,  // Muito alinhado
      tech: 1, 
      culture: 2, 
      all: 2 
    }
  },

  PEDRO: {
    // Líder Antenado - 37 anos, pragmático, business-focused
    name: 'Líder Antenado',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { 
      instagram: 0,  // Não perde tempo com isso
      news: 3,       // MUITO importante pra ele
      coffee: 2,     // Aprecia um café estratégico
      rush: 1        // Organizado demais pra isso
    },
    q2: { 
      conspiracy: 1, 
      gossip: 0,     // Não tem tempo pra isso
      horoscope: 0,  // Pragmático demais
      trends: 2      // Precisa saber o que tá rolando (business)
    },
    q3: { 
      facts: 3,      // SEMPRE o cara dos fatos
      memes: 1,      // Pouco
      listener: 1,   // Mais falante que ouvinte
      organizer: 3   // Líder nato
    },
    interest: { 
      career: 3,     // Principal foco
      lifestyle: 1, 
      tech: 2,       // Importante pro business
      culture: 1, 
      all: 0         // Muito focado
    }
  },

  CAROLINA: {
    // Sábia Sofisticada - 48 anos, madura, estratégica
    name: 'Sábia Sofisticada',
    age_weights: { "18-28": 0, "29-39": 0, "40-49": 2, "50+": 3 },
    q1: { 
      instagram: 0,  // Pouco interesse
      news: 2,       // Informada mas seletiva
      coffee: 3,     // Ritual de contemplação
      rush: 0        // Já passou dessa fase
    },
    q2: { 
      conspiracy: 2, // Mente analítica, gosta de mistério
      gossip: 1,     // Já superou isso
      horoscope: 2,  // Aprecia mas com ceticismo saudável
      trends: 1      // Observa mas não segue
    },
    q3: { 
      facts: 2, 
      memes: 0,      // Não é o estilo dela
      listener: 3,   // MUITO observadora
      organizer: 2   // Mentora, organiza quando necessário
    },
    interest: { 
      career: 2,     // Ainda relevante mas menos urgente
      lifestyle: 2, 
      tech: 1, 
      culture: 3,    // Muito alinhado
      all: 1 
    }
  },

  FELIPE: {
    // Workaholic Equilibrista - 38 anos, sonha com praia
    name: 'Workaholic Equilibrista',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { 
      instagram: 1,  // Usa mas não é viciado
      news: 2,       // Precisa estar informado pro trabalho
      coffee: 2,     // Aprecia o momento
      rush: 2        // Sempre correndo mas não gosta
    },
    q2: { 
      conspiracy: 1, 
      gossip: 1, 
      horoscope: 2,  // Busca sinais de mudança
      trends: 2      // Acompanha
    },
    q3: { 
      facts: 2, 
      memes: 2, 
      listener: 2,   // Equilibrado
      organizer: 2   // Faz mas sonha em parar
    },
    interest: { 
      career: 2,     // Trabalha mas quer menos
      lifestyle: 3,  // MUITO importante (busca qualidade de vida)
      tech: 1, 
      culture: 2, 
      all: 2 
    }
  },

  JULIA: {
    // Mãe Executiva - 38 anos, multitasking, culpa
    name: 'Mãe Executiva',
    age_weights: { "18-28": 0, "29-39": 2, "40-49": 1, "50+": 0 },
    q1: { 
      instagram: 2,  // Acompanha quando pode
      news: 1,       // Menos tempo
      coffee: 1,     // Raramente tem tempo
      rush: 3        // SEMPRE atrasada
    },
    q2: { 
      conspiracy: 0, 
      gossip: 2,     // Escape rápido
      horoscope: 2,  // Busca orientação
      trends: 2      // Quer estar por dentro
    },
    q3: { 
      facts: 1, 
      memes: 2, 
      listener: 2,   // Mãe = ouve muito
      organizer: 3   // TEM que organizar tudo
    },
    interest: { 
      career: 2, 
      lifestyle: 2,  // Busca equilíbrio
      tech: 1, 
      culture: 1, 
      all: 3         // Precisa de tudo misturado
    }
  },

  THIAGO: {
    // Jovem Ansioso - 27 anos, FOMO, ambicioso
    name: 'Jovem Ansioso',
    age_weights: { "18-28": 3, "29-39": 1, "40-49": 0, "50+": 0 },
    q1: { 
      instagram: 3,  // MUITO tempo no Instagram
      news: 2,       // Quer estar informado
      coffee: 0,     // Não tem paciência
      rush: 3        // Sempre correndo, FOMO
    },
    q2: { 
      conspiracy: 2, // Mente inquieta
      gossip: 2,     // Quer saber de tudo
      horoscope: 1, 
      trends: 3      // PRECISA estar por dentro
    },
    q3: { 
      facts: 2,      // Quer impressionar
      memes: 3,      // Linguagem nativa
      listener: 0,   // Mais falante
      organizer: 2   // Tenta organizar (ansiedade)
    },
    interest: { 
      career: 3,     // Obsessão
      lifestyle: 1, 
      tech: 2,       // Importante pra carreira
      culture: 1, 
      all: 2 
    }
  },

  HENRIQUE: {
    // Gourmet Cult - 40 anos, sofisticado, irônico, NÃO liga pra horóscopo
    name: 'Gourmet Cult',
    age_weights: { "18-28": 0, "29-39": 1, "40-49": 2, "50+": 1 },
    q1: { 
      instagram: 1,  // Usa mas seletivamente
      news: 2,       // Informado mas não obcecado
      coffee: 3,     // Ritual gourmet
      rush: 0        // Trabalha pouco, não tem pressa
    },
    q2: { 
      conspiracy: 2, // Mente cult, gosta de mistério
      gossip: 3,     // MUITO (fofoca de celebridade)
      horoscope: 0,  // NÃO liga! Importante!
      trends: 2      // Acompanha com ironia
    },
    q3: { 
      facts: 2,      // Gosta de parecer inteligente
      memes: 1,      // Com moderação cult
      listener: 2,   // Psicoterapeuta
      organizer: 2   // Organiza jantares
    },
    interest: { 
      career: 0,     // Trabalha pouco
      lifestyle: 2, 
      tech: 1, 
      culture: 3,    // MUITO importante
      all: 1 
    }
  }
};

// ========================================
// FUNÇÃO DE DECISÃO INTELIGENTE
// ========================================

function determinePersonaIntelligent(formData) {
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
    
    // Peso da idade (importante!)
    score += weights.age_weights[ageGroup] * 3; // Multiplicador 3 = idade é muito importante
    
    // Q1 - Pode ter múltiplas respostas
    if (formData.q1) {
      const q1Answers = formData.q1.split(', ');
      q1Answers.forEach(answer => {
        score += weights.q1[answer] || 0;
      });
    }
    
    // Q2 - Pode ter múltiplas respostas
    if (formData.q2) {
      const q2Answers = formData.q2.split(', ');
      q2Answers.forEach(answer => {
        score += weights.q2[answer] || 0;
      });
    }
    
    // Q3 - Pode ter múltiplas respostas
    if (formData.q3) {
      const q3Answers = formData.q3.split(', ');
      q3Answers.forEach(answer => {
        score += weights.q3[answer] || 0;
      });
    }
    
    // Interest - Pode ter múltiplas respostas
    if (formData.interest) {
      const interests = formData.interest.split(', ');
      interests.forEach(interest => {
        score += weights.interest[interest] || 0;
      });
    }
    
    scores[personaKey] = score;
  }
  
  // Encontrar persona com maior score
  let bestPersona = 'MARINA'; // Fallback padrão
  let bestScore = 0;
  
  for (const [persona, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestPersona = persona;
    }
  }
  
  // Log para debug (pode remover em produção)
  console.log('🎯 Persona Scores:', scores);
  console.log('✅ Winner:', bestPersona, 'with score', bestScore);
  
  return PERSONA_SCORING[bestPersona].name;
}

// ========================================
// FUNÇÃO AUXILIAR DE IDADE
// ========================================

function calculateAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
