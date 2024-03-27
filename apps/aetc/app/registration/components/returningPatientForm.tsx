import React, { FC } from 'react';
import { FormikInit, SearchComboBox, SelectInputField } from 'shared-ui/src';
import { GenericDialog } from "@/components";
import * as Yup from 'yup';
import { getFacilities, useParameters } from "@/hooks";
import { TrackFormikContext } from ".";
import { concepts, encounters } from "@/constants";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getObservationValue } from "@/helpers/emr";

type Props = {
    initialValues: any;
    onSubmit: (values: any) => void;
    setContext: (context: any) => void;
};

const form = {
    methodOfTransportation: {
        name: concepts.METHOD_OF_TRANSPORTATION,
        label: 'Method Of Transportation',
    },
};

const schema = Yup.object().shape({
    [concepts.REFERRED_FROM]: Yup.string().label('Referee Medical Facility'),
    [form.methodOfTransportation.name]: Yup.string().required().label(form.methodOfTransportation.label),
});

export const ReturningPatientDialog: FC<Props> = ({ onSubmit, initialValues, setContext }) => {
    const { data: facilities, isLoading: loadingFacilities } = getFacilities();
    const { params } = useParameters();
    const { data: encounterList, isLoading: loadingEncounters } = getPatientsEncounters(params?.id as string);

    const referralEncounter = encounterList?.find(encounter => encounter.uuid === encounters.REFERRAL);
    const referred = getObservationValue(referralEncounter?.obs, concepts.IS_PATIENT_REFERRED);

    return (
        <GenericDialog
            open={false}
            onClose={() => { }}
            title={""}
        >
            <FormikInit
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={onSubmit}
            >
                <SelectInputField
                    name={form.methodOfTransportation.name}
                    selectItems={[
                        { name: 'Walking', value: 'walking' },
                        { name: 'Ambulance', value: 'ambulance' },
                        { name: 'Public transport', value: 'public_transport' },
                        { name: 'Private transport', value: 'private_transport' },
                        { name: 'Police vehicle', value: 'police_vehicle' },
                        { name: 'Company vehicle', value: 'company_vehicle' },
                        { name: 'Motorcycle', value: 'motorcycle' },
                        { name: 'Taxi (car/motorcycle)', value: 'taxi' },
                        { name: 'Bicycle', value: 'bicycle' },
                        { name: 'Helicopter', value: 'helicopter' },
                    ]}
                    label={form.methodOfTransportation.label}
                    id={form.methodOfTransportation.name}
                />

                {loadingFacilities ? (
                    <>Loading facilities...</>
                ) : (
                    <SearchComboBox
                        label="Referral Medical Facility"
                        name={concepts.REFERRED_FROM}
                        multiple={false}
                        options={
                            facilities
                                ? facilities.map((facility: any) => ({
                                    id: facility.facility_name,
                                    label: facility.facility_name,
                                }))
                                : []
                        }
                    />
                )}

                <button type="submit">Submit</button>
            </FormikInit>
        </GenericDialog>
    );
};
