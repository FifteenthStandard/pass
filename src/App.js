import {
  useEffect,
  useState,
} from 'react';
import {
  ClickAwayListener,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import {
  Restore,
} from '@mui/icons-material';

import {
  HelperText,
  PasswordField,
  WidthBox,
} from './SharedComponents';

import {
  generatePassword,
  sha256String,
} from './PasswordGenerator';

export default function App() {
  const defaultCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  const [passphrase, setPassphrase] = useState('');
  const [passphraseError, setPassphraseError] = useState('');
  const [application, setApplication] = useState('');
  const [length, setLength] = useState(40);
  const [increment, setIncrement] = useState(0);
  const [characters, setCharacters] = useState(defaultCharacters);
  const [password, setPassword] = useState('');
  const [storedSalt, setStoredSalt] = useState('');
  const [storedHash, setStoredHash] = useState('');

  useEffect(() => {
    const { salt, hash } = JSON.parse(localStorage.getItem('pass') || '{}');
    setStoredSalt(salt);
    setStoredHash(hash);
  }, []);

  useEffect(() => {
    async function runAsync() {
      const hash = await sha256String(JSON.stringify([passphrase, storedSalt]));
      if (storedHash && hash !== storedHash) {
        setPassword('');
        setPassphraseError('Passphrase does not match stored passphrase');
      } else {
        setPassword(await generatePassword(passphrase, application, increment, length, characters));
        setPassphraseError('');
      }
    };
    runAsync();
  }, [passphrase, application, increment, length, characters, storedSalt, storedHash]);

  const onStringChange = set => ev => set(ev.target.value);
  const onNumberChange = set => ev => set(Math.max(0, +ev.target.value));

  const onRestoreClick = ev => setCharacters(defaultCharacters);

  const onSnackClose = set => (ev, reason) => {
    if (reason !== 'clickaway') set(false);
  };
  const [copiedSnackOpen, setCopiedSnackOpen] = useState(false);
  const onPasswordFocus = ev => {
    ev.target.select();
    navigator.clipboard.writeText(ev.target.value);
    ev.stopPropagation();
    setWipedSnackOpen(false);
    setCopiedSnackOpen(true);
  };

  const [wipedSnackOpen, setWipedSnackOpen] = useState(false);
  const onClickAway = ev => {
    navigator.clipboard.writeText('');
    setCopiedSnackOpen(false);
    setWipedSnackOpen(true);
  };

  return <WidthBox component="form" noValidate autoComplete="off">
    <Stack direction="column" justifyContent="center" height="100vh">
      <ClickAwayListener onClickAway={onClickAway}>
        <Paper sx={theme => ({
          paddingInline: theme.spacing(2),
          paddingTop: theme.spacing(3),
        })}>
        <PasswordField
          autoFocus
          required
          fullWidth
          label="Passphrase"
          autoComplete="off"
          value={passphrase}
          error={!!passphraseError}
          helperText={passphraseError || <HelperText text={'Your master passphrase. Should be long and memorable'} />}
          onInput={onStringChange(setPassphrase)}
          sx={theme => ({ paddingBlock: theme.spacing(1) })}
        />
        <PasswordField
          required
          fullWidth
          label="Application"
          autoComplete="off"
          helperText={<HelperText text={'A unique identifier for this password, e.g. application name'} />}
          value={application}
          onInput={onStringChange(setApplication)}
          sx={theme => ({ paddingBlock: theme.spacing(1) })}
        />
        <Grid container>
          <Grid xs={6} sx={theme => ({ paddingRight: theme.spacing(1) })}>
            <TextField
              required
              fullWidth
              label="Increment"
              type="number"
              autoComplete="off"
              helperText={<HelperText text={'Times you\'ve rotated this password'} />}
              value={increment}
              onInput={onNumberChange(setIncrement)}
              sx={theme => ({ paddingBlock: theme.spacing(1) })}
            />
          </Grid>
          <Grid xs={6} sx={theme => ({ paddingLeft: theme.spacing(1) })}>
            <TextField
              required
              fullWidth
              label="Length"
              type="number"
              autoComplete="off"
              helperText={<HelperText text={'Length of this password. Longer is better'} />}
              value={length}
              onInput={onNumberChange(setLength)}
              sx={theme => ({ paddingBlock: theme.spacing(1) })}
            />
          </Grid>
        </Grid>
        <TextField
          required
          fullWidth
          label="Characters"
          value={characters}
          helperText={<HelperText text={'Characters to use in this password. More is better'} />}
          onInput={onStringChange(setCharacters)}
          sx={theme => ({ paddingBlock: theme.spacing(1) })}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                onClick={onRestoreClick}
                tabIndex="-1"
                title="Reset to default characters"
              >
                <Restore />
              </IconButton>
            </InputAdornment>
          }}
        />
        <PasswordField
          fullWidth
          readOnly
          disabled={password === ''}
          label="Password"
          value={password}
          helperText={<HelperText text={'Your password. It was just copied to your clipboard'} />}
          onFocus={onPasswordFocus}
          sx={theme => ({ paddingBlock: theme.spacing(1) })}
        />
        </Paper>
      </ClickAwayListener>
    </Stack>
    <Snackbar
      open={copiedSnackOpen}
      autoHideDuration={6000}
      onClose={onSnackClose(setCopiedSnackOpen)}
      message='Password copied to clipboard'
    />
    <Snackbar
      open={wipedSnackOpen}
      autoHideDuration={6000}
      onClose={onSnackClose(setWipedSnackOpen)}
      message='Clipboard wiped'
    />
  </WidthBox>;
};
