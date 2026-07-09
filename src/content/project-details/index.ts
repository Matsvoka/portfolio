import type { ProjectDetail } from '../types';
import { doctag } from './doctag';
import { graphit } from './graphit';
import { hcpApp } from './hcp-app';
import { valentines } from './valentines';
import { cablagem } from './cablagem';
import { extrator } from './extrator';
import { itinerario } from './itinerario';
import { abastecimento } from './abastecimento';
import { hcpMargens } from './hcp-margens';

export const projectDetails: Record<string, ProjectDetail> = {
  doctag,
  graphit,
  'hcp-app': hcpApp,
  valentines,
  cablagem,
  extrator,
  itinerario,
  abastecimento,
  'hcp-margens': hcpMargens,
};
