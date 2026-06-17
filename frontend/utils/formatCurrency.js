export function formatarMoeda(valor) {
  const num = Number(valor);
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarNumero(valor) {
  const num = Number(valor);
  if (isNaN(num)) return '0';
  return num.toLocaleString('pt-BR');
}

export function parseMoeda(str) {
  if (typeof str === 'number') return str;
  const cleaned = String(str).replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
