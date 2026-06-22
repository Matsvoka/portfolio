'use client';

import { useState, type MouseEvent } from 'react';

type Node = { id: number; x: number; y: number };

export function GraphItMock() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nextId, setNextId] = useState(1);

  function addNodeAt(x: number, y: number) {
    setNodes((current) => [...current, { id: nextId, x, y }]);
    setNextId((id) => id + 1);
  }

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    addNodeAt(event.clientX - rect.left, event.clientY - rect.top);
  }

  function handleAddViaKeyboard() {
    const offset = (nodes.length % 5) * 40;
    addNodeAt(40 + offset, 40 + offset);
  }

  return (
    <div className="rounded-md bg-bg-dim p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[12px] uppercase tracking-wide text-fg-muted">
          GraphIt — clique na área para desenhar um nó
        </p>
        <button
          type="button"
          onClick={handleAddViaKeyboard}
          className="rounded bg-lime-soft px-3 py-1 font-mono text-[12px] text-lime-deep motion-safe:transition-transform motion-safe:active:scale-95"
        >
          + Adicionar nó (teclado)
        </button>
      </div>
      <div
        role="application"
        aria-label="Área de desenho do grafo"
        onClick={handleCanvasClick}
        className="relative h-48 w-full cursor-crosshair rounded bg-bg"
      >
        {nodes.map((node) => (
          <span
            key={node.id}
            aria-hidden="true"
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime motion-safe:transition-transform"
            style={{ left: node.x, top: node.y }}
          />
        ))}
        <span className="sr-only">{nodes.length} nó(s) no grafo.</span>
      </div>
    </div>
  );
}
