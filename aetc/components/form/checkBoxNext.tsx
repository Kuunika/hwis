import { concepts } from "@/constants";
import { getDateTime } from "@/helpers/dateTime";
import { Button, Checkbox, FormControlLabel } from "@mui/material";

type Props = {
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  onNext: (obs: any) => void;
  title: string;
};

export const CheckBoxNext = ({
  isChecked,
  setIsChecked,
  onNext,
  title,
}: Props) => {
  const handleNext = () => {
    onNext([
      {
        concept: concepts.IS_NORMAL,
        value: concepts.YES,
        obsDateTime: getDateTime(),
      },
    ]);
  };
  return (
    <>
      <FormControlLabel
        label={title}
        control={
          <Checkbox
            checked={isChecked}
            onChange={(event) => {
              setIsChecked(event.currentTarget.checked);
            }}
          />
        }
      />
      <br />

      {isChecked && (
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ borderRadius: "1px" }}
        >
          Next
        </Button>
      )}
    </>
  );
};
