export function normalizeBrazilianPhone(input?: string | null): string | null {
  if (!input) return null;
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits.startsWith("55")) digits = `55${digits}`;
  const national = digits.slice(2);
  const ddd = Number(national.slice(0, 2));
  if (![10, 11].includes(national.length) || ddd < 11 || ddd > 99) return null;
  return digits;
}
export function maskPhone(phone: string): string { return `(${phone.slice(2,4)}) ${phone.slice(4,5)}****-${phone.slice(-4)}`; }
