import {
  Atom,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode,
  FlaskConical,
  ScanSearch,
  Server,
  Terminal,
  TestTube2,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  FileCode,
  Atom,
  Server,
  Database,
  Container,
  FlaskConical,
  TestTube2,
  ScanSearch,
  Cloud,
  Workflow,
  Terminal,
};

export function SkillIcon({ name, size = 11 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Code2;
  return <Icon size={size} aria-hidden="true" />;
}
