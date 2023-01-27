import {
  useState,
} from 'react';
import {
  Button,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import {
  Delete,
} from '@mui/icons-material';

import {
  HelperText,
  PasswordField,
  WidthBox,
} from './SharedComponents';

import {
  arrayToHex,
  getRandomValues,
  sha256String,
} from './PasswordGenerator';


export default function Setup() {
  const [passphrase, setPassphrase] = useState('');
  const [confirm, setConfirm] = useState('');

  const [passphraseError, setPassphraseError] = useState('');
  const confirmError = confirm && confirm !== passphrase
    ? 'Passphrases do not match' : '';
  const canSubmit = passphrase && passphrase === confirm;

  const onStringChange = set => ev => set(ev.target.value);

  const onSubmit = async ev => {
    ev.preventDefault();
    if (!canSubmit) return;

    const salt = arrayToHex(getRandomValues(64));
    const hash = await sha256String(JSON.stringify([passphrase, salt]));
    localStorage.setItem('pass', JSON.stringify({ salt, hash }));
    window.location = '/pass';
  }

  const onClear = ev => {
    localStorage.removeItem('pass');
    window.location = '/pass';
  };

  return <WidthBox component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
    <Stack direction="column" justifyContent="center" height="100vh">
      <Paper sx={theme => ({
        padding: theme.spacing(2),
        paddingTop: theme.spacing(3),
      })}>
      <PasswordField
        autoFocus
        required
        fullWidth
        label="Passphrase"
        autoComplete="off"
        error={!!passphraseError}
        value={passphrase}
        helperText={passphraseError || <HelperText text="Your master passphrase. Should be long and memorable" />}
        onInput={onStringChange(setPassphrase)}
        onBlur={_ => { setPassphraseError(!!passphrase ? '' : 'Passphrase is required') }}
        sx={theme => ({ paddingBlock: theme.spacing(1) })}
      />
      <PasswordField
        required
        fullWidth
        label="Confirm"
        autoComplete="off"
        value={confirm}
        error={!!confirmError}
        helperText={confirmError || <HelperText text="Your master passphrase again. Wouldn't want a typo" />}
        onInput={onStringChange(setConfirm)}
        sx={theme => ({ paddingBlock: theme.spacing(1) })}
      />
      <Grid container sx={{width: '100%'}}>
        <Grid>
          <Button variant="outlined" color="error" onClick={onClear} startIcon={<Delete />}>
            Clear stored hash
          </Button>
        </Grid>
        <Grid sx={{marginLeft: 'auto'}}>
          <Button variant="contained" type="submit" disabled={!canSubmit}>Confirm</Button>
        </Grid>
      </Grid>
      </Paper>
    </Stack>
  </WidthBox>
};
