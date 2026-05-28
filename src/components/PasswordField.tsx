import { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function PasswordField(props: React.ComponentProps<typeof TextField>): React.ReactElement {
  const [ showPassword, setShowPassword ] = useState(false);

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          endAdornment: (
            <IconButton
              title={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((show) => !show)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        },
      }}
    />
  );
};
