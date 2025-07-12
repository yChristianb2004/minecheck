import { MinecraftProfile } from '../types';

// Usar apenas o proxy local para a API Mojang (evita CORS e instabilidade)
const MOJANG_API_BASE = '/mojang-api/users/profiles/minecraft';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    // Chama o endpoint proxy do Vite
    const response = await fetch(`${MOJANG_API_BASE}/${username}`, {
      headers: {
        'Accept': 'application/json',
      }
    });

    // 204 = encontrado (ocupado), 200 = encontrado (ocupado), 404 = não encontrado (disponível)
    if (response.status === 404) {
      // Username não encontrado = disponível
      return true;
    }

    if (response.status === 204 || response.ok) {
      // Username encontrado = ocupado
      return false;
    }

    // Se der erro inesperado, assume indisponível
    return false;
  } catch (error) {
    // Para usernames muito comuns, assumir que estão ocupados
    const commonUsernames = ['admin', 'test', 'player', 'user', 'minecraft', 'notch', 'steve', 'alex'];
    if (commonUsernames.includes(username.toLowerCase())) {
      return false;
    }
    // Para outros casos, assume indisponível
    return false;
  }
}

export function generateRandomUsernames(
  startLetter: string, 
  count: number = 20, 
  minLength: number = 3, 
  maxLength: number = 8
): string[] {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const vowels = 'aeiou';
  const numbers = '0123456789';
  
  const usernames: string[] = [];
  const usedNames = new Set<string>();
  
  // Ajustar padrões baseado no tamanho desejado
  const createPatterns = () => {
    const patterns = [];
    
    // Padrões para usernames curtos (3-5 chars)
    if (minLength <= 5) {
      patterns.push(
        () => startLetter + getRandomChar(consonants) + getRandomChar(vowels),
        () => startLetter + getRandomChar(vowels) + getRandomChar(consonants),
        () => startLetter + getRandomChar(consonants) + getRandomChar(numbers),
        () => startLetter + getRandomChar(vowels) + getRandomChar(numbers),
        () => startLetter + Math.floor(Math.random() * 99)
      );
    }
    
    // Padrões para usernames médios (4-8 chars)
    if (maxLength >= 4) {
      patterns.push(
        () => startLetter + getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(consonants),
        () => startLetter + getRandomChar(vowels) + getRandomChar(consonants) + getRandomChar(vowels),
        () => startLetter + getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(numbers),
        () => startLetter + getRandomChar(vowels) + getRandomChar(consonants) + getRandomChar(numbers),
        () => startLetter + getRandomChar(consonants) + Math.floor(Math.random() * 999)
      );
    }
    
    // Padrões para usernames longos (6+ chars)
    if (maxLength >= 6) {
      patterns.push(
        () => startLetter + getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(consonants) + getRandomChar(vowels),
        () => startLetter + getRandomChar(vowels) + getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(consonants),
        () => startLetter + getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(consonants) + getRandomChar(numbers),
        () => startLetter + Math.random().toString(36).substring(2, Math.min(7, maxLength)),
        () => startLetter + getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(consonants) + getRandomChar(vowels) + getRandomChar(consonants)
      );
    }
    
    return patterns;
  };
  
  const patterns = createPatterns();
  
  let attempts = 0;
  while (usernames.length < count && attempts < count * 5) {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let username = pattern().toString();
    
    // Ajustar tamanho para estar dentro dos limites
    while (username.length < minLength) {
      const charType = Math.random();
      if (charType < 0.4) {
        username += getRandomChar(consonants);
      } else if (charType < 0.8) {
        username += getRandomChar(vowels);
      } else {
        username += getRandomChar(numbers);
      }
    }
    
    // Truncar se muito longo
    if (username.length > maxLength) {
      username = username.substring(0, maxLength);
    }
    
    // Verificar se está dentro dos limites corretos
    if (username.length >= minLength && username.length <= maxLength) {
      // Evitar usernames muito comuns
      const commonPatterns = ['123', '456', '789', 'abc', 'xyz'];
      const isCommon = commonPatterns.some(pattern => username.toLowerCase().includes(pattern));
      
      if (!usedNames.has(username.toLowerCase()) && !isCommon) {
        usedNames.add(username.toLowerCase());
        usernames.push(username);
      }
    }
    
    attempts++;
  }
  
  // Preencher slots restantes com combinações mais únicas
  while (usernames.length < count) {
    const timestamp = Date.now().toString().slice(-3);
    const randomPart = Math.random().toString(36).substring(2, Math.min(5, maxLength - 1));
    let username = startLetter + randomPart;
    
    // Ajustar tamanho
    if (username.length < minLength) {
      username += timestamp.slice(0, minLength - username.length);
    }
    if (username.length > maxLength) {
      username = username.substring(0, maxLength);
    }
    
    if (!usedNames.has(username.toLowerCase()) && 
        username.length >= minLength && 
        username.length <= maxLength) {
      usedNames.add(username.toLowerCase());
      usernames.push(username);
    }
    
    // Evitar loop infinito
    if (attempts++ > count * 10) break;
  }
  
  return usernames;
}

/**
 * Gera variações realmente infinitas e aleatórias de usernames baseados em uma palavra-chave.
 */
export function generateRelatedUsernames(
  base: string,
  count: number = 20,
  minLength: number = 3,
  maxLength: number = 16,
  randomSide: 'before' | 'after' = 'after'
): string[] {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
  const usernames: string[] = [];
  const used = new Set<string>();

  let attempts = 0;
  while (usernames.length < count && attempts < count * 500) {
    let patternType = Math.floor(Math.random() * 8);
    let nick = base;
    let randNum = Math.floor(Math.random() * 100000);
    let randChar = chars[Math.floor(Math.random() * chars.length)];

    // Geração controlada pelo lado
    if (randomSide === 'before') {
      // Aleatório antes do nome base
      switch (patternType) {
        case 0:
        case 5:
        case 6:
          nick = Array.from({length: Math.floor(Math.random() * 3) + 1}, () => chars[Math.floor(Math.random() * chars.length)]).join('') + base;
          break;
        case 1:
        case 2:
        case 3:
          nick = randNum + base;
          break;
        case 4:
          let insertPos = 0;
          let randInsert = Array.from({length: Math.floor(Math.random() * 2) + 1}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
          nick = randInsert + base;
          break;
        case 7:
          let arr = (base + Array.from({length: Math.floor(Math.random() * 3)}, () => chars[Math.floor(Math.random() * chars.length)]).join('')).split('');
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          nick = arr.join('');
          break;
        default:
          break;
      }
    } else {
      // Aleatório depois do nome base
      switch (patternType) {
        case 0:
        case 5:
        case 6:
          nick = base + Array.from({length: Math.floor(Math.random() * 3) + 1}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
          break;
        case 1:
        case 2:
        case 3:
          nick = base + randNum;
          break;
        case 4:
          let insertPos = base.length;
          let randInsert = Array.from({length: Math.floor(Math.random() * 2) + 1}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
          nick = base + randInsert;
          break;
        case 7:
          let arr = (base + Array.from({length: Math.floor(Math.random() * 3)}, () => chars[Math.floor(Math.random() * chars.length)]).join('')).split('');
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          nick = arr.join('');
          break;
        default:
          break;
      }
    }

    // Ajusta tamanho
    if (nick.length < minLength) {
      nick = nick + randChar.repeat(minLength - nick.length);
    }
    if (nick.length > maxLength) {
      nick = nick.substring(0, maxLength);
    }

    if (
      nick.length >= minLength &&
      nick.length <= maxLength &&
      !used.has(nick.toLowerCase())
    ) {
      usernames.push(nick);
      used.add(nick.toLowerCase());
    }
    attempts++;
  }

  // Se ainda não atingiu o count, preenche com base + timestamp
  while (usernames.length < count) {
    const nick = base + Date.now().toString().slice(-Math.min(4, maxLength - base.length));
    if (
      nick.length >= minLength &&
      nick.length <= maxLength &&
      !used.has(nick.toLowerCase())
    ) {
      usernames.push(nick);
      used.add(nick.toLowerCase());
    }
    if (usernames.length >= count) break;
  }

  return usernames.slice(0, count);
}

function getRandomChar(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * Avalia a "beleza" de um username com heurísticas simples.
 * Retorna um score de 0 (feio) a 100 (muito bonito).
 */
export function beautyScore(username: string): number {
  const idealMin = 4;
  const idealMax = 8;
  const negativeWords = ['bad', 'ugly', '666', 'xxx', 'shit', 'fuck'];
  const hasNumber = /\d/.test(username);
  const hasSpecial = /[^a-zA-Z0-9_]/.test(username);
  const lower = username.toLowerCase();

  // Penalidade se contiver palavras negativas
  if (negativeWords.some(w => lower.includes(w))) return 0;

  let score = 50;

  // Comprimento ideal
  if (username.length >= idealMin && username.length <= idealMax) {
    score += 20;
  } else if (username.length < idealMin || username.length > 12) {
    score -= 15;
  }

  // Penalidade por números ou caracteres especiais
  if (hasNumber) score -= 10;
  if (hasSpecial) score -= 20;

  // Bônus para alternância vogal/consoante
  const vowels = 'aeiou';
  let alternance = 0;
  for (let i = 1; i < username.length; i++) {
    if (
      (vowels.includes(lower[i - 1]) && !vowels.includes(lower[i])) ||
      (!vowels.includes(lower[i - 1]) && vowels.includes(lower[i]))
    ) {
      alternance++;
    }
  }
  score += Math.min(alternance * 2, 10);

  // Bônus para repetição de letras (mas não exagerado)
  const repeats = /(.)\1/.test(lower);
  if (repeats) score += 5;

  // Bônus se não tiver números nem especiais
  if (!hasNumber && !hasSpecial) score += 10;

  // Clamp entre 0 e 100
  return Math.max(0, Math.min(100, score));
}