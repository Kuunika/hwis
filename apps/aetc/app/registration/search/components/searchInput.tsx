import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { FaSearch } from "react-icons/fa";

type Prop = {
  onChange: (values: any) => void;
  initialValue: string;
  label?: string;
  placeHolder?: string;
};
export const SearchInput = ({
  onChange,
  initialValue,
  label = "Search Patient",
  placeHolder = "",
}: Prop) => {
  return (
    <TextField
      id="search"
      label={label}
      name="search"
      defaultValue={initialValue}
      fullWidth
      sx={{}}
      placeholder={placeHolder}
      onChange={(values) => {
        onChange(values.target.value);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment
            sx={{ color: (theme) => theme.palette.primary.main }}
            position="start"
          >
            <FaSearch />
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
};
