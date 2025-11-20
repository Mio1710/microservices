import { Controller } from 'react-hook-form';
import { FieldError } from '../ui/field';
import { Input } from '../ui/input';

interface AppInputProps {
  name: string;
  control: any;
  type?: string;
  placeholder?: string;
  className?: string;
}

export const AppInput = ({
  control,
  name,
  type = 'text',
  placeholder,
  ...props
}: AppInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div data-invalid={fieldState.invalid}>
          <Input {...field} type={type} placeholder={placeholder} {...props} />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="mt-1" />
          )}
        </div>
      )}
    />
  );
};
