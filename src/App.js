import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  ClickAwayListener,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import {
  useFormControl,
} from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

import './App.css';

async function generatePassword(passphrase, application, increment, length, characters) {
  async function sha256Bytes(str) {
    const buffer = new TextEncoder('utf-8').encode(str);
    return new Uint8Array(await crypto.subtle.digest('SHA-256', buffer));
  }

  async function* genBytes(phrase1, phrase2) {
    for (let index = 0;; index += 1) {
      const hash = await sha256Bytes(JSON.stringify([phrase1, phrase2, index]));
      for (let byte of hash) yield byte;
    }
  }

  if (passphrase === '' || application === '') return '';

  const gen = genBytes(passphrase, application + increment);
  let password = '';
  for (let i = 0; i < length; i++) {
      password += characters[(await gen.next()).value % characters.length];
  }
  return password;
}

const WidthBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
    boxSizing: 'border-box',
    width: '100%',
  },
  [theme.breakpoints.up('md')]: {
    margin: 'auto',
    maxWidth: '600px',
  },
  height: '100vh',
  overflow: 'hidden',
}));

const Input = styled(TextField)(({ theme }) => ({
  paddingBlock: theme.spacing(1),
}));

function HelperText(props) {
  const { focused } = useFormControl() || {};

  const helperText = useMemo(() => {
    return focused ? props.text : ' ';
  }, [focused, props.text]);

  return helperText;
};

function App() {
  const [passphrase, setPassphrase] = useState('');
  const [application, setApplication] = useState('');
  const [length, setLength] = useState(40);
  const [increment, setIncrement] = useState(0);
  const [characters, setCharacters] = useState('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function runAsync() {
      setPassword(await generatePassword(passphrase, application, increment, length, characters));
    };
    runAsync();
  }, [passphrase, application, increment, length, characters]);

  const onStringChange = set => ev => set(ev.target.value);
  const onNumberChange = set => ev => set(Math.max(0, +ev.target.value));

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
        <div>
        <Input
          autoFocus
          required
          fullWidth
          label="Passphrase"
          type="password"
          autoComplete="off"
          value={passphrase}
          helperText={<HelperText text={'Your master passphrase. Should be long and memorable'} />}
          onInput={onStringChange(setPassphrase)}
        />
        <Input
          required
          fullWidth
          label="Application"
          type="password"
          autoComplete="off"
          helperText={<HelperText text={'A unique identifier for this password, e.g. application name'} />}
          value={application}
          onInput={onStringChange(setApplication)}
        />
        <Input
          required
          fullWidth
          label="Increment"
          type="number"
          autoComplete="off"
          helperText={<HelperText text={'Number of times you\'ve rotated this password'} />}
          value={increment}
          onInput={onNumberChange(setIncrement)}
        />
        <Input
          required
          fullWidth
          label="Length"
          type="number"
          autoComplete="off"
          helperText={<HelperText text={'Length of this password. Longer is better'} />}
          value={length}
          onInput={onNumberChange(setLength)}
        />
        <Input
          required
          fullWidth
          label="Characters"
          value={characters}
          helperText={<HelperText text={'Characters to use in this password. More is better'} />}
          onInput={onStringChange(setCharacters)}
        />
        <Input
          fullWidth
          readOnly
          disabled={password === ''}
          type="password"
          label="Password"
          value={password}
          helperText={<HelperText text={'Your password. It was just copied to your clipboard'} />}
          onFocus={onPasswordFocus}
        />
        </div>
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
  </WidthBox>
}

export default App;
