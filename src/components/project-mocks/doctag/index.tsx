'use client';

import { useState, type DragEvent, type KeyboardEvent } from 'react';

const AVAILABLE_TAGS = ['Contrato', 'Fatura', 'Relatório'];

type DocumentItem = { id: string; name: string; tag: string };

const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: 'doc-1', name: 'Proposta — Cliente A.pdf', tag: 'Contrato' },
  { id: 'doc-2', name: 'NF 00231.pdf', tag: 'Fatura' },
  { id: 'doc-3', name: 'Status mensal.pdf', tag: 'Relatório' },
];

export function DoctagMock() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function setTag(id: string, tag: string) {
    setDocuments((current) => current.map((doc) => (doc.id === id ? { ...doc, tag } : doc)));
  }

  function cycleTag(id: string, direction: 1 | -1) {
    setDocuments((current) =>
      current.map((doc) => {
        if (doc.id !== id) return doc;
        const index = AVAILABLE_TAGS.indexOf(doc.tag);
        const nextIndex = (index + direction + AVAILABLE_TAGS.length) % AVAILABLE_TAGS.length;
        return { ...doc, tag: AVAILABLE_TAGS[nextIndex] };
      }),
    );
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>, targetId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const draggedDoc = documents.find((doc) => doc.id === draggedId);
      if (draggedDoc) setTag(targetId, draggedDoc.tag);
    }
    setDraggedId(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      cycleTag(id, 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      cycleTag(id, -1);
    }
  }

  return (
    <div className="rounded-md bg-bg-dim p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
        Doctag — arraste a tag de um documento sobre outro, ou foque nela e use ← → para trocar
      </p>
      <ul className="flex flex-col gap-2">
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-3 rounded bg-bg px-3 py-2">
            <span className="text-xs text-fg">{doc.name}</span>
            <button
              type="button"
              draggable
              onDragStart={() => setDraggedId(doc.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, doc.id)}
              onKeyDown={(event) => handleKeyDown(event, doc.id)}
              aria-label={`Tag de ${doc.name}: ${doc.tag}. Use as setas para mudar.`}
              className="cursor-grab rounded bg-lime-soft px-2.5 py-1 font-mono text-[11px] text-lime-deep active:cursor-grabbing motion-safe:transition-transform motion-safe:active:scale-95"
            >
              {doc.tag}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
