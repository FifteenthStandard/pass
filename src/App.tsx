import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import {
  ContentCopy,
  ExpandLess,
  ExpandMore,
  LockPerson,
  Restore,
} from '@mui/icons-material';
import { InputWithIconButton, NumberSpinner, PasswordField } from './components';
import { generatePassword, getPasskey, savePasskey } from './helpers';

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';


export default function App(): React.ReactElement {
  const [ passphrase, setPassphrase ] = useState('');
  const [ application, setApplication ] = useState('');
  const [ increment, setIncrement ] = useState(0);
  const [ length, setLength ] = useState(40);
  const [ characters, setCharacters ] = useState(DEFAULT_CHARACTERS);
  const [ password, setPassword ] = useState('');

  const [ settingsExpanded, setSettingsExpanded ] = useState(false);

  const [ copiedSnackbarOpen, setCopiedSnackbarOpen ] = useState(false);
  const [ wipedSnackbarOpen, setWipedSnackbarOpen ] = useState(false);

  const [ savePasskeyDialogOpen, setSavePasskeyDialogOpen ] = useState(false);
  const [ passkeyName, setPasskeyName ] = useState('');
  const [ confirmPassphrase, setConfirmPassphrase ] = useState('');

  useEffect(() => {
    async function loadPasskey() {
      const passkeyPassphrase = await getPasskey();
      if (passkeyPassphrase) {
        setPassphrase(passkeyPassphrase);
      }
    }
    loadPasskey();
  }, []);

  useEffect(() => {
    async function generate() {
      const password = await generatePassword(passphrase, application, increment, length, characters);
      setPassword(password);
    }
    generate();
  }, [ passphrase, application, increment, length, characters ]);

  function handleClickSavePasskey() {
    setSavePasskeyDialogOpen(true);
  };

  function handleCloseSavePasskey() {
    setSavePasskeyDialogOpen(false);
    setPasskeyName('');
    setConfirmPassphrase('');
  };

  async function handleSavePasskey(event: React.FormEvent) {
    event.preventDefault();
    if (passkeyName && passphrase === confirmPassphrase) {
      await savePasskey(passkeyName, passphrase);
    }
    handleCloseSavePasskey();
  };

  function handleClickSettings() {
    setSettingsExpanded((expanded) => !expanded);
  };

  function handleClickRestoreCharacters() {
    setCharacters(DEFAULT_CHARACTERS);
  };

  function handleCopyPassword(event: React.FormEvent) {
    event.preventDefault();
    navigator.clipboard.writeText(password);
    setCopiedSnackbarOpen(true);
    setWipedSnackbarOpen(false);
  };

  function handleWipePassword() {
    navigator.clipboard.writeText(' '.repeat(password.length));
    setCopiedSnackbarOpen(false);
    setWipedSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        justifyContent: 'center',
        margin: 'auto',
        maxWidth: 600,
        padding: 2,
      }}
    >
      <ClickAwayListener onClickAway={handleWipePassword}>
        <Paper sx={{ p: 2 }}>
          <form onSubmit={handleCopyPassword}>
            <input
              type="submit"
              hidden
              disabled={password === ''}
            />
            <Stack spacing={2}>
              <InputWithIconButton
                input={<PasswordField
                  label="Passphrase"
                  required
                  autoComplete="webauthn"
                  autoFocus
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />}
                icon={<LockPerson />}
                title="Save as passkey"
                disabled={passphrase === ''}
                onClick={handleClickSavePasskey}
              />
              <InputWithIconButton
                input={<PasswordField
                  label="Application"
                  autoComplete="off"
                  required
                  value={application}
                  onChange={e => setApplication(e.target.value)}
                />}
                icon={settingsExpanded ? <ExpandLess /> : <ExpandMore />}
                title={settingsExpanded ? 'Hide settings' : 'Show settings'}
                onClick={handleClickSettings}
              />
              {settingsExpanded && <>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <NumberSpinner
                    label="Increment"
                    min={0}
                    value={increment}
                    onValueChange={(value) => setIncrement(value ?? 0)}
                    sx={{ flex: 1 }}
                  />
                  <NumberSpinner
                    label="Length"
                    min={1}
                    max={100}
                    value={length}
                    onValueChange={(value) => setLength(value ?? 1)}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <InputWithIconButton
                  input={<TextField
                    type="text"
                    label="Characters"
                    required
                    autoComplete="off"
                    value={characters}
                    onChange={(e) => setCharacters(e.target.value)}
                  />}
                  icon={<Restore />}
                  title="Restore default characters"
                  onClick={handleClickRestoreCharacters}
                />
              </>}
              <InputWithIconButton
                input={<PasswordField
                  label="Password"
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />}
                icon={<ContentCopy />}
                title="Copy password to clipboard"
                disabled={password === ''}
                onClick={handleCopyPassword}
              />
            </Stack>
          </form>
          <Dialog
            open={savePasskeyDialogOpen}
            onClose={handleCloseSavePasskey}
            fullWidth
          >
            <DialogTitle>Save as passkey</DialogTitle>
            <form onSubmit={handleSavePasskey}>
              <input
                type="submit"
                hidden
                disabled={confirmPassphrase !== passphrase || passkeyName === ''}
              />
              <Stack spacing={2} sx={{ p: 2 }}>
                <TextField
                  type="text"
                  label="Passkey name"
                  required
                  value={passkeyName}
                  onChange={(e) => setPasskeyName(e.target.value)}
                />
                <PasswordField
                  label="Confirm passphrase"
                  required
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                />
              </Stack>
            </form>
            <DialogActions>
              <Button onClick={handleCloseSavePasskey}>Cancel</Button>
              <Button
                disabled={confirmPassphrase !== passphrase || passkeyName === ''}
                onClick={handleSavePasskey}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </ClickAwayListener>
      <Snackbar
        open={copiedSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setCopiedSnackbarOpen(false)}
        message="Password copied to clipboard"
      />
      <Snackbar
        open={wipedSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setWipedSnackbarOpen(false)}
        message="Password wiped from clipboard"
      />
    </Box>
  )
};
