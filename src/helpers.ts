export async function generatePassword(passphrase: string, application: string, increment: number, length: number, characters: string): Promise<string> {
  if (passphrase === '' || application === '') return '';

  passphrase = passphrase.replaceAll(' ', '');

  const gen = genBytes(passphrase, application + increment);
  let password = '';
  for (let i = 0; i < length; i++) {
      password += characters[((await gen.next()).value as number) % characters.length];
  }
  return password;

  async function* genBytes(phrase1: string, phrase2: string) {
    for (let index = 0; ; index += 1) {
      const hash = await sha256Bytes(JSON.stringify([phrase1, phrase2, index]));
      for (const byte of hash) yield byte;
    }
  };
  
  async function sha256Bytes(str: string): Promise<Uint8Array> {
    const buffer = new TextEncoder().encode(str);
    return new Uint8Array(await crypto.subtle.digest('SHA-256', buffer));
  };
};

const rpId = window.location.hostname;
const loginAbortController = new AbortController();

export async function getPasskey(): Promise<string | null> {
  if (!await PublicKeyCredential.isConditionalMediationAvailable()) return null;
  const credentials = await navigator.credentials.get({
    publicKey: {
      challenge: new Uint8Array(32),
      rpId: rpId,
      userVerification: 'required',
    },
    mediation: 'conditional',
    signal: loginAbortController.signal,
  });

  if (!credentials) return null;

  const response = (credentials as PublicKeyCredential).response as AuthenticatorAssertionResponse;

  if (!response.userHandle) return null;

  const passphraseBytes = new Uint8Array(response.userHandle);
  const passphrase = new TextDecoder().decode(passphraseBytes);
  return passphrase;
};

export async function savePasskey(name: string, passphrase: string): Promise<void> {
  loginAbortController.abort();
  await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array(32),
      rp: { id: rpId, name: 'Fifteenth Standard' },
      user: {
        id: new TextEncoder().encode(passphrase),
        name: name,
        displayName: name,
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      authenticatorSelection: {
        residentKey: 'required',
        requireResidentKey: true,
        userVerification: 'required',
      },
    },
  });
};
