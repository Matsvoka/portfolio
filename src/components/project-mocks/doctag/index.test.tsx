import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoctagMock } from './index';

describe('DoctagMock', () => {
  it('renders a tag button per document with its current tag', () => {
    render(<DoctagMock />);
    expect(
      screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Contrato/ }),
    ).toBeInTheDocument();
  });

  it('cycles the tag forward with ArrowRight', async () => {
    const user = userEvent.setup();
    render(<DoctagMock />);
    const tagButton = screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Contrato/ });
    tagButton.focus();
    await user.keyboard('{ArrowRight}');
    expect(
      screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Fatura/ }),
    ).toBeInTheDocument();
  });

  it('cycles the tag backward with ArrowLeft, wrapping around to the last tag', async () => {
    const user = userEvent.setup();
    render(<DoctagMock />);
    const tagButton = screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Contrato/ });
    tagButton.focus();
    await user.keyboard('{ArrowLeft}');
    expect(
      screen.getByRole('button', { name: /Proposta — Cliente A\.pdf: Relatório/ }),
    ).toBeInTheDocument();
  });
});
