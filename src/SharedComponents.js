import {
  useMemo,
  useState,
} from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

function HelperText(props) {
  const { focused } = useFormControl() || {};

  const helperText = useMemo(() => {
    return focused ? props.text : '⠀';
  }, [focused, props.text]);

  return helperText;
};

function PasswordField(props) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return <TextField
    {...props}
    type={showPassword ? 'text' : 'password'}
    InputProps={{
      readOnly: props.readOnly,
      endAdornment: <InputAdornment position="end">
        <IconButton
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          tabIndex={-1}
          title={showPassword ? 'Hide pasword' : 'Show password'}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    }}
  />;
};

const WidthBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    boxSizing: 'border-box',
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    margin: 'auto',
    maxWidth: '600px',
  },
  height: '100vh',
  overflow: 'hidden',
}));

export {
  HelperText,
  PasswordField,
  WidthBox,
};