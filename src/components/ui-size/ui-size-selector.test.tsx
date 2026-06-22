import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UiSizeSelector } from './ui-size-selector';

afterEach(() => {
  document.documentElement.removeAttribute('data-ui-size');
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('UiSizeSelector', () => {
  it('starts from the preset applied by the head script', () => {
    document.documentElement.dataset.uiSize = 'subtle';
    render(<UiSizeSelector />);

    expect(screen.getByRole('combobox', { name: 'Tamanho da interface' })).toHaveValue('subtle');
  });

  it('updates the document, tab storage, and URL without reloading', async () => {
    const user = userEvent.setup();
    document.documentElement.dataset.uiSize = 'original';
    render(<UiSizeSelector />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Tamanho da interface' }),
      'large',
    );

    expect(document.documentElement).toHaveAttribute('data-ui-size', 'large');
    expect(window.sessionStorage.getItem('ui-size')).toBe('large');
    expect(new URL(window.location.href).searchParams.get('size')).toBe('large');
  });
});
