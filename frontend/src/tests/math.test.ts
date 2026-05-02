import { describe, it, expect } from 'vitest';

// Función muy simple para demostrar pruebas de lógica pura sin React
function calcularEfectividad(malezasEncontradas: number, malezasEliminadas: number): number {
  if (malezasEncontradas === 0) return 100;
  return (malezasEliminadas / malezasEncontradas) * 100;
}

describe('Lógica Matemática - Efectividad', () => {
  it('calcula la efectividad correctamente (100%)', () => {
    const resultado = calcularEfectividad(10, 10);
    expect(resultado).toBe(100);
  });

  it('calcula la efectividad correctamente (50%)', () => {
    const resultado = calcularEfectividad(10, 5);
    expect(resultado).toBe(50);
  });

  it('retorna 100% si no se encontraron malezas (evita división por cero)', () => {
    const resultado = calcularEfectividad(0, 0);
    expect(resultado).toBe(100);
  });
});
