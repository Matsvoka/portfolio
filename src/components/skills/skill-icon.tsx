import { Atom, Code2, Container, Database, FileCode, Server, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  FileCode,
  Atom,
  Server,
  Database,
  Container,
};

export function SkillIcon({ name, size = 11 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Code2;
  return <Icon size={size} aria-hidden="true" />;
}
