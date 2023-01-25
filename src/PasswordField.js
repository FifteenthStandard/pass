import {
  useState,
} from 'react';
import {
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

export default function PasswordField(props) {
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
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    }}
  />;
};