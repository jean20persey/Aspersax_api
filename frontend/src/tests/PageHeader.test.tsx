import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageHeader from '../components/PageHeader';

describe('PageHeader Component', () => {
  it('renders the title passed via props correctly', () => {
    // 1. Arrange: Renderizamos el componente con un título de prueba
    const testTitle = 'Panel de Control - Finca La Riverita';
    render(<PageHeader title={testTitle} />);

    // 2. Act: Buscamos el elemento en el DOM simulado (jsdom)
    const headerElement = screen.getByText(testTitle);

    // 3. Assert: Verificamos que esté en el documento (gracias a jest-dom)
    expect(headerElement).toBeInTheDocument();
    
    // Verificamos que el tag sea un H1
    expect(headerElement.tagName).toBe('H1');
  });
});
