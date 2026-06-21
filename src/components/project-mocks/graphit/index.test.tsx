import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphItMock } from './index';

describe('GraphItMock', () => {
  it('starts with no nodes', () => {
    render(<GraphItMock />);
    expect(screen.getByText('0 nó(s) no grafo.')).toBeInTheDocument();
  });

  it('adds a node when the canvas is clicked', async () => {
    const user = userEvent.setup();
    render(<GraphItMock />);
    await user.click(screen.getByRole('application', { name: 'Área de desenho do grafo' }));
    expect(screen.getByText('1 nó(s) no grafo.')).toBeInTheDocument();
  });

  it('adds a node via the keyboard-accessible button', async () => {
    const user = userEvent.setup();
    render(<GraphItMock />);
    await user.click(screen.getByRole('button', { name: '+ Adicionar nó (teclado)' }));
    expect(screen.getByText('1 nó(s) no grafo.')).toBeInTheDocument();
  });
});
