const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const MESES_CURTOS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

function toDate(date) {
  if (typeof date === 'string') {
    const parts = date.split('T')[0].split('-').map(Number);
    if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(date);
}

export function formatarDataCompleta(date) {
  const d = toDate(date);
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatarDataCurta(date) {
  const d = toDate(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatarDataISO(date) {
  const d = toDate(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatarMesAno(date) {
  const d = toDate(date);
  return `${MESES_CURTOS[d.getMonth()]} ${d.getFullYear()}`;
}

export function tempoRelativo(date) {
  const agora = new Date();
  const d = toDate(date);
  const diff = agora - d;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Ontem';
  if (dias < 7) return `Há ${dias} dias`;
  if (dias < 30) return `Há ${Math.floor(dias / 7)} semana${Math.floor(dias / 7) > 1 ? 's' : ''}`;
  if (dias < 365) return `Há ${Math.floor(dias / 30)} mês${Math.floor(dias / 30) > 1 ? 'es' : ''}`;
  return `Há ${Math.floor(dias / 365)} ano${Math.floor(dias / 365) > 1 ? 's' : ''}`;
}

export function getSemanaDates(offset = 0) {
  const agora = new Date();
  const inicio = new Date(agora);
  inicio.setDate(agora.getDate() - agora.getDay() + 1 + offset * 7);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    dates.push(d);
  }
  return dates;
}
