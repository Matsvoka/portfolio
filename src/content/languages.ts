export type LanguageEntry = {
  name: string;
  proficiency: string;
  countryCode: 'BR' | 'US' | 'KR' | 'JP';
};

export const languages: LanguageEntry[] = [
  { name: 'Português', proficiency: 'Nativo', countryCode: 'BR' },
  { name: 'Inglês', proficiency: 'C2', countryCode: 'US' },
  { name: 'Coreano', proficiency: 'B1', countryCode: 'KR' },
  { name: 'Japonês', proficiency: 'A2', countryCode: 'JP' },
];
