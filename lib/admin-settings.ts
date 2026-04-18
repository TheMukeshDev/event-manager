export const defaultSettings = {
  registration_link: '',
  whatsapp_community_link: '',
  is_whatsapp_join_mandatory: false,
  certificate_rules_text: '',
  certificate_id_prefix: '',
  sponsor_cta_whatsapp_number: '919771894062',
  sponsor_cta_default_message: 'Hello, I am interested in sponsoring your event.',
  sponsor_cta_visible: true,
  campus_ambassador_enabled: true,
  referral_threshold: 10,
  reward_title: 'Certificate of Appreciation',
  reward_description: 'Bring referrals and unlock rewards.',
  use_external_proof_form: true,
  external_proof_form_link: '',
  leaderboard_visible: true,
  ambassador_share_message: 'Hi! Join using my referral link:',
}

export const legacySettings = {
  registration_link: 'https://techhubbbs.com/register',
  whatsapp_community_link: 'https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA',
  is_whatsapp_join_mandatory: true,
  certificate_rules_text: 'Certificates are issued only to valid registered participants who attend/attempt the event and follow all event rules.',
  certificate_id_prefix: 'BBSCET-TQ-2026',
  sponsor_cta_whatsapp_number: '919771894062',
  sponsor_cta_default_message: 'Hello Mukesh Kumar, I am interested in sponsoring your event. Please share the sponsorship details.',
  sponsor_cta_visible: true,
  campus_ambassador_enabled: true,
  referral_threshold: 10,
  reward_title: 'Certificate of Appreciation + Google swag',
  reward_description: 'Bring 10 valid referrals and unlock rewards, recognition and ambassador status.',
  use_external_proof_form: true,
  external_proof_form_link: 'https://forms.gle/your-campus-ambassador-proof-form',
  leaderboard_visible: true,
  ambassador_share_message: 'Hi! Join the Tech Hub BBS challenge using my referral link:',
}

let settingsStore = { ...defaultSettings }

export function getSettings() {
  return settingsStore
}

export function saveSettings(newSettings: Partial<typeof defaultSettings>) {
  settingsStore = { ...settingsStore, ...newSettings }
  return settingsStore
}
