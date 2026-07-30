export type ChatRole = 'user' | 'aetheron' | 'system';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  streaming?: boolean;
  /** Optional embedded signature analysis payload id/ticker */
  signatureTicker?: string;
};

export type AvatarForm = 'sphere' | 'titan' | 'realm_guide';

export const AVATAR_FORM_LABELS: Record<AvatarForm, string> = {
  sphere: 'Sphere',
  titan: 'Titan',
  realm_guide: 'Realm Guide',
};
