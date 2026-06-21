import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DemoSlot } from './demo-slot';

describe('DemoSlot', () => {
  it('renders nothing for demo.type "none"', () => {
    const { container } = render(<DemoSlot demo={{ type: 'none' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a video element for demo.type "video"', () => {
    render(<DemoSlot demo={{ type: 'video', src: '/videos/x.mp4' }} />);
    expect(document.querySelector('video source')).toHaveAttribute('src', '/videos/x.mp4');
  });

  it('renders an img element for demo.type "gif"', () => {
    render(<DemoSlot demo={{ type: 'gif', src: '/gifs/x.gif' }} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/gifs/x.gif');
  });

  it('renders nothing for an unregistered mock key', () => {
    const { container } = render(<DemoSlot demo={{ type: 'mock', component: 'not-real' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the registered mock component for demo.type "mock"', async () => {
    render(<DemoSlot demo={{ type: 'mock', component: 'doctag' }} />);
    expect(await screen.findByText(/Doctag —/)).toBeInTheDocument();
  });
});
