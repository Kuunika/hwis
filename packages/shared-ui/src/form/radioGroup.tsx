import { FC} from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useFormikField } from "./hooks";


type Prop = {
  label: string;
  name: string;
  options: Array<{ label: string; value: string | number }>;
  stylings?: boolean;
  getValue?: (value: any) => void;
};

export const RadioGroupInput: FC<Prop> = ({
  label,
  name,
  options,
  getValue,
}) => {
  const { value, handleChange, hasError } = useFormikField(name);

  useEffect(() => {
    if (getValue) getValue(value);
  }, [value]);

  return (
    <FormControl error={hasError}>
      <FormLabel id={name}>{label}</FormLabel>
      <RadioGroup value={value} onChange={handleChange} name={name}>
        {options.map(({ label, value }) => (
          <FormControlLabel
            key={label}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
