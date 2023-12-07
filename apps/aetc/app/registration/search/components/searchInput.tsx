import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { FaSearch } from "react-icons/fa";

type Prop = {
  onChange: (values: any) => void;
  initialValue: string;
};
export const SearchInput = ({ onChange, initialValue }: Prop) => {
  return (
    <TextField
      id="search"
      label="Search Patient"
      name="search"
      defaultValue={initialValue}
      fullWidth
      onChange={(values) => {
        onChange(values.target.value);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FaSearch />
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
};
