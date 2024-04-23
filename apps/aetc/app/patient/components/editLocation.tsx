import { LocationType } from "@/app/registration/components";
import { countries } from "@/constants/contries";
import { LocationContext, LocationContextType } from "@/contexts/location";
import { useContext, useEffect, useState } from "react";
import { FormikInit, SearchComboBox } from "shared-ui/src"
import * as Yup from "yup";

type Props = {
    onSubmit: (values: any) => void,
    initialValues: any
}

const schema = Yup.object().shape({
    district: Yup.string(),
    traditionalAuthority: Yup.string(),
    village: Yup.string(),
    nationality: Yup.string(),
})

export const EditLocation = ({
    onSubmit,
    initialValues
}: Props) => {
    const { villages, districts, traditionalAuthorities } = useContext(LocationContext) as LocationContextType
    const [selectedLocation, setSelectedLocation] = useState<LocationType>({ village: "", traditionalAuthority: "", district: "" })

    useEffect(() => {
        const districtId = districts.find(d => d.name == initialValues.district)?.district_id;
        const traditionalAuthorityId = traditionalAuthorities.find(d => d.name == initialValues.traditionalAuthority)?.traditional_authority_id;
        const villageId = villages.find(d => d.name == initialValues.village)?.village_id;

        setSelectedLocation({ village: villageId, traditionalAuthority: traditionalAuthorityId, district: districtId })
    }, [])

    return <FormikInit submitButtonText="update" initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
        <SearchComboBox
            name={"nationality"}
            label={'Nationality'}
            multiple={false}
            options={countries.map((c) => ({
                id: c.nationality,
                label: c.nationality,
            }))}
        />
        <SearchComboBox
            name={'district'}
            label={'District'}
            multiple={false}
            getValue={(value) => {
                const district = districts.find(d => d.name == value);
                if (district) {
                    setSelectedLocation(selection => ({ ...selection, district: district.district_id.toString() }))
                }

            }}
            options={districts ? districts.map((d) => ({
                id: d.name,
                label: d.name,
            })) : []}
        />
        <SearchComboBox
            name={'traditionalAuthoruty'}
            label={'Traditional Authority '}
            multiple={false}
            getValue={(value) => {
                const traditionalAuthority = traditionalAuthorities.find(d => d.name == value);

                if (traditionalAuthority)
                    setSelectedLocation(selection => ({ ...selection, traditionalAuthority: traditionalAuthority.traditional_authority_id.toString() }))
            }}

            options={traditionalAuthorities ? traditionalAuthorities.filter(t => t.district_id.toString() == selectedLocation.district).map(t => ({
                id: t.name,
                label: t.name
            })) : []}
        />
        <SearchComboBox
            name={'village'}
            label={'Village'}
            multiple={false}
            options={villages ? villages.filter(v => v.traditional_authority_id.toString() == selectedLocation.traditionalAuthority).map((v: any) => ({
                id: v.name,
                label: v.name
            })) : []}
        />
    </FormikInit>
}