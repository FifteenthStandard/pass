import { Box, IconButton } from '@mui/material';

type InputWithIconButtonProps = {
  input: React.ReactNode;
  icon: React.ReactNode;
  title?: string;
  disabled?: boolean;
  onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
};

export default function InputWithIconButton({ input, icon, title, disabled, onClick }: InputWithIconButtonProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        '& .MuiFormControl-root': {
          flex: 1,
        },
        '& .MuiOutlinedInput-root': {
          fontFamily: 'Roboto Mono, monospace',
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
        },
      }}
    >
      {input}
      <IconButton
        onClick={onClick}
        title={title}
        disabled={disabled}
        sx={(theme) => ({
          bgcolor: 'action.hover',
          border: '1px solid',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 4,
          borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 4,
          paddingInline: 2,
          '&:active, &:focus': {
            bgcolor: 'action.hover',
          }
        })}
      >
        {icon}
      </IconButton>
    </Box>
  );
};
