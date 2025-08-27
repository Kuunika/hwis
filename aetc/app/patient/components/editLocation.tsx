import { LocationType, TrackFormikContext } from "@/app/registration/components";
import { countries } from "@/constants/contries";
import { LocationContext, LocationContextType } from "@/contexts/location";
import { useContext, useEffect, useState } from "react";
import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import * as Yup from "yup";

type Props = {
  onSubmit: (values: any) => void;
  initialValues: any;
  currentLocation?: boolean;
  onFormValueChange?: (values: any) => void;
  submitButton?: boolean;
    setContext?: (context: any) => void;
};

const schema = Yup.object().shape({
  district: Yup.string(),
  traditionalAuthority: Yup.string(),
  village: Yup.string(),
  nationality: Yup.string(),
});

export const EditLocation = ({
  onSubmit,
  initialValues,
  currentLocation = false,
  onFormValueChange = () => {},
  submitButton = true,
setContext=(values)=>{} 
}: Props) => {
  const { villages, districts, traditionalAuthorities } = useContext(
    LocationContext
  ) as LocationContextType;
  const [selectedLocation, setSelectedLocation] = useState<LocationType>({
    village: "",
    traditionalAuthority: "",
    district: "",
  });
  const [init, setInit] = useState({});

  useEffect(() => {
    const districtId = districts.find(
      (d) => d.name == initialValues.district
    )?.district_id;
    const traditionalAuthorityId = traditionalAuthorities.find(
      (d) => d.name == initialValues.traditionalAuthority
    )?.traditional_authority_id;
    const villageId = villages.find(
      (d) => d.name == initialValues.village
    )?.village_id;
    setSelectedLocation({
      village: villageId,
      traditionalAuthority: traditionalAuthorityId,
      district: districtId,
    });
  }, []);

  useEffect(() => {
    setInit(initialValues);
  }, [selectedLocation]);

  return (
    <FormikInit
      submitButtonText="update"
      enableReinitialize={true}
      initialValues={init}
      validationSchema={schema}
      onSubmit={onSubmit}
      getFormValues={onFormValueChange}
      submitButton={submitButton}
    >

      {!currentLocation && (
        <SearchComboBox
          name={"nationality"}
          label={"Nationality"}
          multiple={false}
          options={countries.map((c) => ({
            id: c.nationality,
            label: c.nationality,
          }))}
        />
      )}

<TrackFormikContext
          setFormContext={setContext}
        />
      <SearchComboBox
        name={"district"}
        label={"District"}
        multiple={false}
        getValue={(value) => {
          const district = districts.find((d) => d.name == value);
          if (district) {
            setSelectedLocation((selection) => ({
              ...selection,
              district: district.district_id.toString(),
            }));
          }
        }}
        options={
          districts
            ? districts.map((d) => ({
                id: d.name,
                label: d.name,
              }))
            : []
        }
      />
      <SearchComboBox
        name={"traditionalAuthority"}
        label={"Traditional Authority "}
        multiple={false}
        getValue={(value) => {
          const traditionalAuthority = traditionalAuthorities.find(
            (d) => d.name == value
          );

          if (traditionalAuthority)
            setSelectedLocation((selection) => ({
              ...selection,
              traditionalAuthority:
                traditionalAuthority.traditional_authority_id.toString(),
            }));
        }}
        options={
          traditionalAuthorities
            ? traditionalAuthorities
                .filter(
                  (t) => t.district_id.toString() == selectedLocation.district
                )
                .map((t) => ({
                  id: t.name,
                  label: t.name,
                }))
            : []
        }
      />
      <SearchComboBox
        name={"village"}
        label={"Village"}
        multiple={false}
        options={
          villages
            ? villages
                .filter(
                  (v) =>
                    v.traditional_authority_id.toString() ==
                    selectedLocation.traditionalAuthority
                )
                .map((v: any) => ({
                  id: v.name,
                  label: v.name,
                }))
            : []
        }
      />

{currentLocation && <TextInputField
            sx={{width:"100%"}}
            name={"closeLandMark"}
            id={"closeLandMark"}
            label={"Close Land Mark"}
          />}
      
    </FormikInit>
  );
};
