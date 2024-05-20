'use client'

import {
  FormikInit,
  FormFieldContainerLayout,
  SelectInputField,
  RadioGroupInput,
  FieldsContainer,
  TextInputField,
} from 'shared-ui/src';
import { getInitialValues } from "@/helpers";
import * as Yup from "yup";
import { useState } from 'react';

type Prop = {
  onSubmit: (values: any) => void;
};

const form = {
  leftPupilSize: {
    name: "Left pupil size",
    label: "Left pupil",
  },
  rightPupilSize:{
    name: "Right pupil size",
    label: "Right pupil",
  },
  eyePallor:{
    name: "Pallor",
    label: "Pallor",
  },
  juandice:{
    name: "Juandice",
    label: "Juandice",
  },
  racoonEyesLeftEye:{
    name: "Racoon eyes left eye",
    label: "Left eye",
  },
  racoonEyesRightEye:{
    name: "Racoon eyes eight eye",
    label: "Right eye",
  },
  hyphemaLeftEye:{
    name: "hyphema left eye",
    label: "Left eye",
  },
  hyphemaRightEye:{
    name: "hyphema right Eye",
    label: "Right eye",
  },
  eyelidLeftEye:{
    name: "Eyelid injury left eye",
    label: "Left eye",
  },
  eyelidRightEye:{
    name: "Eyelid injury right eye",
    label: "Right eye",
  },
  eyesOther:{
    id:"eyesOther",
    name: "Eyes other",
    label: "Other eye abnormalities"
  },
  fundoscopy:{
    id: "fundoscopy",
    name: "fundoscopy",
    label: "fundoscopy"
  },
  oralThrush:{
    id: "Oral thrush",
    name: "Oral thrush",
    label: "Oral thrush"
  },
  kaposisSarcomaLesions:{
    id: "Kaposi's sarcoma lesions",
    name: "Kaposi's sarcoma lesions",
    label: "Kaposi's sarcoma lesions"
  },
  tongueLaceration:{
    id: "Tongue laceration",
    name: "Tongue laceration",
    label: "Tongue laceration"
  },
  looseTeeth:{
    id: "Loose teeth",
    name: "Loose teeth",
    label: "Loose teeth"
  },
  mouthOther:{
    id:"mouthOther",
    name: "Mouth other",
    label: "Other mouth abnormalities"

  },
  leftEarBleeding:{
    id:"Bleeding from the left ear",
    name: "Bleeding from the left ear",
    label: "Left ear"
  },
  rightEarBleeding:{
    id:"Bleeding from the right ear",
    name: "Bleeding from the right ear",
    label: "Right ear"
  },
  leftEarOtorrhoea:{
    id:"Left ear otorrhoea",
    name: "Left ear otorrhoea",
    label: "Left ear"
  },
  rightEarOtorrhoea:{
    id:"Right ear otorrhoea",
    name: "Right ear otorrhoea",
    label: "Right ear"
  },
  leftEarLaceration:{
    id:"Left ear laceration",
    name: "Left ear laceration",
    label: "Left ear"
  },
  rightEarLaceration:{
    id:"Right ear laceration",
    name: "Right ear laceration",
    label: "Right ear"
  },
  earlacerationDetails:{
    id:"Laceration details",
    name: "Laceration details",
    label: "Laceration details"
  },
  leftEarOtoscopy:{
    id:"Left ear otoscopy",
    name: "Left ear otoscopy",
    label: "Left ear"
  },
  rightEarOtoscopy:{
    id:"Right ear otoscopy",
    name: "Right ear otoscopy",
    label: "Right ear"
  },
  otoscopyDetails:{
    id:"Otoscopy details",
    name: "Otoscopy details",
    label: "Otoscopy details"
  },
  noseBleed:{
    id:"Nose bleed",
    name:"Nose bleed",
    label:"Nose bleed"
  },
  rhinorrhoea:{
    id:"Rhinorrhoea",
    name:"Rhinorrhoea",
    label:"Rhinorrhoea"
  },
  noseLaceration:{
    id:"Nose laceration",
    name: "Nose laceration",
    label: "Nose laceration"
  },
  noseLacerationDetails:{
    id:"Laceration details",
    name: "Laceration details",
    label: "Laceration details"
  },
  leftTemporalLaceration:{
    id:"Left temporal laceration",
    name: "Left temporal laceration",
    label: "Laceration"
  },
  leftTemporalLacerationLength:{
    id:"Left temporal laceration length",
    name: "Left temporal laceration length",
    label: "Length"
  },
  leftTemporalLacerationDepth:{
    id:"Left temporal laceration depth",
    name: "Left temporal laceration depth",
    label: "Depth"
  },
  leftTemporalBruise:{
    id:"Left temporal bruise",
    name: "Left temporal bruise",
    label: "Bruise"
  },
  leftTemporalBruiseDetails:{
    id:"Left temporal bruise details",
    name: "Left temporal bruise details",
    label: "Details"
  },
  leftTemporalHaematoma:{
    id:"Left temporal haematoma",
    name: "Left temporal haematoma",
    label: "Haematoma"
  },
  leftTemporalFracture:{
    id:"Left temporal fracture",
    name: "Left temporal fracture",
    label: "Fracture"
  },
  leftTemporalOther:{
    id:"Left temporal other",
    name: "Left temporal other",
    label: "Other details"
  },
  rightTemporalLaceration: {
    id: 'RightTemporal laceration',
    name: 'Right temporal laceration',
    label: 'Laceration'
  },
  rightTemporalLacerationLength: {
    id: 'RightTemporal laceration length',
    name: 'Right temporal laceration length',
    label: 'Length'
  },
  rightTemporalLacerationDepth: {
    id: 'RightTemporal laceration depth',
    name: 'Right temporal laceration depth',
    label: 'Depth'
  },
  rightTemporalBruise: {
    id: 'RightTemporal bruise',
    name: 'Right temporal bruise',
    label: 'Bruise'
  },
  rightTemporalBruiseDetails: {
    id: 'RightTemporal bruise details',
    name: 'Right temporal bruise details',
    label: 'Details'
  },
  rightTemporalHaematoma: {
    id: 'RightTemporal haematoma',
    name: 'Right temporal haematoma',
    label: 'Haematoma'
  },
  rightTemporalFracture: {
    id: 'RightTemporal fracture',
    name: 'Right temporal fracture',
    label: 'Fracture'
  },
  rightTemporalOther: {
    id: 'RightTemporal other',
    name: 'Right temporal other',
    label: 'Other details'
  },
  occiputLaceration: {
    id: 'Occiput laceration',
    name: 'Occiput laceration',
    label: 'Laceration'
  },
  occiputLacerationLength: {
    id: 'Occiput laceration length',
    name: 'Occiput laceration length',
    label: 'Length'
  },
  occiputLacerationDepth: {
    id: 'Occiput laceration depth',
    name: 'Occiput laceration depth',
    label: 'Depth'
  },
  occiputBruise: {
    id: 'Occiput bruise',
    name: 'Occiput bruise',
    label: 'Bruise'
  },
  occiputBruiseDetails: {
    id: 'Occiput bruise details',
    name: 'Occiput bruise details',
    label: 'Details'
  },
  occiputHaematoma: {
    id: 'Occiput haematoma',
    name: 'Occiput haematoma',
    label: 'Haematoma'
  },
  occiputFracture: {
    id: 'Occiput fracture',
    name: 'Occiput fracture',
    label: 'Fracture'
  },
  occiputOther: {
    id: 'Occiput other',
    name: 'Occiput other',
    label: 'Other details'
  },
  crownLaceration: {
    id: 'Crown laceration',
    name: 'Crown laceration',
    label: 'Laceration'
  },
  crownLacerationLength: {
    id: 'Crown laceration length',
    name: 'Crown laceration length',
    label: 'Length'
  },
  crownLacerationDepth: {
    id: 'Crown laceration depth',
    name: 'Crown laceration depth',
    label: 'Depth'
  },
  crownBruise: {
    id: 'Crown bruise',
    name: 'Crown bruise',
    label: 'Bruise'
  },
  crownBruiseDetails: {
    id: 'Crown bruise details',
    name: 'Crown bruise details',
    label: 'Details'
  },
  crownHaematoma: {
    id: 'Crown haematoma',
    name: 'Crown haematoma',
    label: 'Haematoma'
  },
  crownFracture: {
    id: 'Crown fracture',
    name: 'Crown fracture',
    label: 'Fracture'
  },
  crownOther: {
    id: 'Crown other',
    name: 'Crown other',
    label: 'Other details'
  },
  cheeksLaceration:{
    id: 'Cheek laceration',
    name: 'Cheek laceration',
    label: 'Laceration'
  },
  cheeksLacerationLength: {
    id: 'Cheek laceration length',
    name: 'Cheek laceration length',
    label: 'Length'
  },
  cheeksLacerationDepth: {
    id: 'Cheek laceration depth',
    name: 'Cheek laceration depth',
    label: 'Depth'
  },
  cheeksBruise:{
    id: 'Cheek bruise',
    name: 'Cheek bruise',
    label: 'Bruise'
  },
  cheeksBruiseDetails: {
    id: 'Cheeks bruise details',
    name: 'Cheeks bruise details',
    label: 'Details'
  },
  foreheadLaceration: {
    id: 'Forehead laceration',
    name: 'Forehead laceration',
    label: 'Laceration'
  },
  foreheadLacerationLength: {
    id: 'Forehead laceration length',
    name: 'Forehead laceration length',
    label: 'Length'
  },
  foreheadLacerationDepth: {
    id: 'Forehead laceration depth',
    name: 'Forehead laceration depth',
    label: 'Depth'
  },
  foreheadBruise: {
    id: 'Forehead bruise',
    name: 'Forehead bruise',
    label: 'Bruise'
  },
  foreheadBruiseDetails: {
    id: 'Forehead bruise details',
    name: 'Forehead bruise details',
    label: 'Details'
  },
  chinLaceration: {
    id: 'Chin laceration',
    name: 'Chin laceration',
    label: 'Laceration'
  },
  chinLacerationLength: {
    id: 'Chin laceration length',
    name: 'Chin laceration length',
    label: 'Length'
  },
  chinLacerationDepth: {
    id: 'Chin laceration depth',
    name: 'Chin laceration depth',
    label: 'Depth'
  },
  chinBruise: {
    id: 'Chin bruise',
    name: 'Chin bruise',
    label: 'Bruise'
  },
  chinBruiseDetails: {
    id: 'Chin bruise details',
    name: 'Chin bruise details',
    label: 'Details'
  },
  lipsLaceration: {
    id: 'Lips laceration',
    name: 'Lips laceration',
    label: 'Laceration'
  },
  lipsLacerationLength: {
    id: 'Lips laceration length',
    name: 'Lips laceration length',
    label: 'Length'
  },
  lipsLacerationDepth: {
    id: 'Lips laceration depth',
    name: 'Lips laceration depth',
    label: 'Depth'
  },
  lipsBruise: {
    id: 'Lips bruise',
    name: 'Lips bruise',
    label: 'Bruise'
  },
  lipsBruiseDetails: {
    id: 'Lips bruise details',
    name: 'Lips bruise details',
    label: 'Details'
  },
  trachea:{
    id: 'Trachea',
    name: 'Trachea',
    label: 'Trachea'
  },
  tracheaDeviation:{
    id: 'Trachea deviation',
    name: 'Trachea deviation',
    label: 'Trachea deviation'
  },
  jugularVenousPressure:{
    id: 'Jugular venous pressure',
    name: 'Jugular venous pressure',
    label: 'Jugular venous pressure'
  },
  neckRaised:{
    id: 'Neck raised',
    name: 'Neck raised',
    label: 'Neck raised'
  },
  neckRaisedHeight:{
    id: 'Neck raised height',
    name: 'Neck raised height',
    label: 'Neck raised height'
  },
  enlargedThyroid:{
    id: 'Enlarged thyroid',
    name: 'Enlarged thyroid',
    label: 'Enlarged thyroid'
  },
  neckHaematoma: {
    id: 'Neck haematoma',
    name: 'Neck haematoma',
    label: 'Haematoma'
  },
  lymphNodes: {
    id: 'Lymph nodes',
    name: 'Lymph nodes',
    label: 'Lymph nodes'
  },
  lymphNodeLocation: {
    id: 'Lymph node location',
    name: 'Lymph node location',
    label: 'Lymph node location'
  },
  lymphNodeSize: {
    id: 'Lymph node size',
    name: 'Lymph node size',
    label: 'Lymph node size'
  },
  lymphNodeMobility: {
    id: 'Lymph node mobility',
    name: 'Lymph node mobility',
    label: 'Lymph node mobility'
  },
  lymphNodeTenderness: {
    id: 'Lymph node tenderness',
    name: 'Lymph node tenderness',
    label: 'Lymph node tenderness'
  },
  neckLaceration: {
    id: 'Neck laceration',
    name: 'Neck laceration',
    label: 'Laceration'
  },
  neckLacerationLength: {
    id: 'Neck laceration length',
    name: 'Neck laceration length',
    label: 'Length'
  },
  neckLacerationDepth: {
    id: 'Neck laceration depth',
    name: 'Neck laceration depth',
    label: 'Depth'
  },
  neckBruise: {
    id: 'Neck bruise',
    name: 'Neck bruise',
    label: 'Bruise'
  },
  neckBruiseDetails: {
    id: 'Neck bruise details',
    name: 'Neck bruise details',
    label: 'Details'
  },
  neckAdditionalNotes:{
    id: 'Neck additional notes',
    name: 'Neck bruise details',
    label: 'Details'
  }
};

  const schema = Yup.object().shape({
    [form.leftPupilSize.name]: Yup.string().required().label(form.leftPupilSize.label),
    [form.rightPupilSize.name]: Yup.string().required().label(form.rightPupilSize.label),
    [form.eyePallor.name]: Yup.string().required().label(form.eyePallor.label),
    [form.juandice.name]: Yup.string().required().label(form.juandice.label),
    [form.racoonEyesLeftEye.name]: Yup.string(),
    [form.racoonEyesRightEye.name]: Yup.string(),
    [form.hyphemaLeftEye.name]: Yup.string(),
    [form.hyphemaRightEye.name]: Yup.string(),
    [form.eyelidLeftEye.name]: Yup.string(),
    [form.eyelidRightEye.name]: Yup.string(),
    [form.eyesOther.name]: Yup.string(),
    [form.fundoscopy.name]: Yup.string(),

    [form.oralThrush.name]: Yup.string().required().label(form.oralThrush.label),
    [form.kaposisSarcomaLesions.name]: Yup.string().required().label(form.kaposisSarcomaLesions.label),
    [form.tongueLaceration.name]: Yup.string(),
    [form.looseTeeth.name]: Yup.string(),
    [form.mouthOther.name]: Yup.string(),

    [form.leftEarBleeding.name]:Yup.string().required().label(form.leftEarBleeding.label),
    [form.rightEarBleeding.name]:Yup.string().required().label(form.rightEarBleeding.label),
    [form.leftEarOtorrhoea.name]:Yup.string().required().label(form.leftEarOtorrhoea.label),
    [form.rightEarOtorrhoea.name]:Yup.string().required().label(form.rightEarOtorrhoea.label),
    [form.leftEarLaceration.name]:Yup.string().required().label(form.leftEarLaceration.label),
    [form.rightEarLaceration.name]:Yup.string().required().label(form.rightEarLaceration.label),
    [form.earlacerationDetails.name]:Yup.string().required(),
    [form.leftEarOtoscopy.name]:Yup.string().required().label(form.leftEarOtoscopy.label),
    [form.rightEarOtoscopy.name]:Yup.string().required().label(form.rightEarOtoscopy.label),
    [form.otoscopyDetails.name]:Yup.string(),

    [form.noseBleed.name]:Yup.string().required().label(form.noseBleed.label),
    [form.rhinorrhoea.name]:Yup.string().required().label(form.rhinorrhoea.label),
    [form.noseLaceration.name]:Yup.string().required().label(form.noseLaceration.label),
    [form.noseLacerationDetails.name]:Yup.string(),

    [form.leftTemporalLaceration.name]:Yup.string().required().label(form.leftTemporalLaceration.label),
    [form.leftTemporalLacerationLength.name]:Yup.string(),
    [form.leftTemporalLacerationDepth.name]:Yup.string(),
    [form.leftTemporalBruise.name]:Yup.string().required().label(form.leftTemporalBruise.label),
    [form.leftTemporalBruiseDetails.name]:Yup.string(),
    [form.leftTemporalHaematoma.name]:Yup.string().required().label(form.leftTemporalHaematoma.label),
    [form.leftTemporalFracture.name]:Yup.string().required().label(form.leftTemporalFracture.label),
    [form.leftTemporalOther.name]:Yup.string(),
    
    [form.rightTemporalLaceration.name]: Yup.string().required().label(form.rightTemporalLaceration.label),
    [form.rightTemporalLacerationLength.name]: Yup.string(),
    [form.rightTemporalLacerationDepth.name]: Yup.string(),
    [form.rightTemporalBruise.name]: Yup.string().required().label(form.rightTemporalBruise.label),
    [form.rightTemporalBruiseDetails.name]: Yup.string(),
    [form.rightTemporalHaematoma.name]: Yup.string().required().label(form.rightTemporalHaematoma.label),
    [form.rightTemporalFracture.name]: Yup.string().required().label(form.rightTemporalFracture.label),
    [form.rightTemporalOther.name]: Yup.string(),

    [form.occiputLaceration.name]: Yup.string().required().label(form.occiputLaceration.label),
    [form.occiputLacerationLength.name]: Yup.string(),
    [form.occiputLacerationDepth.name]: Yup.string(),
    [form.occiputBruise.name]: Yup.string().required().label(form.occiputBruise.label),
    [form.occiputBruiseDetails.name]: Yup.string(),
    [form.occiputHaematoma.name]: Yup.string().required().label(form.occiputHaematoma.label),
    [form.occiputFracture.name]: Yup.string().required().label(form.occiputFracture.label),
    [form.occiputOther.name]: Yup.string(),

    [form.crownLaceration.name]: Yup.string().required().label(form.crownLaceration.label),
    [form.crownLacerationLength.name]: Yup.string(),
    [form.crownLacerationDepth.name]: Yup.string(),
    [form.crownBruise.name]: Yup.string().required().label(form.crownBruise.label),
    [form.crownBruiseDetails.name]: Yup.string(),
    [form.crownHaematoma.name]: Yup.string().required().label(form.crownHaematoma.label),
    [form.crownFracture.name]: Yup.string().required().label(form.crownFracture.label),
    [form.crownOther.name]: Yup.string(),

    [form.cheeksLaceration.name]: Yup.string().required().label(form.cheeksLaceration.label),
    [form.cheeksBruise.name]: Yup.string().required().label(form.cheeksBruise.label),
    [form.cheeksBruiseDetails.name]: Yup.string(),
    [form.cheeksLacerationLength.name]: Yup.string(),
    [form.cheeksLacerationDepth.name]: Yup.string(),

    [form.foreheadLaceration.name]: Yup.string().required().label(form.foreheadLaceration.label),
    [form.foreheadLacerationLength.name]: Yup.string(),
    [form.foreheadLacerationDepth.name]: Yup.string(),
    [form.foreheadBruise.name]: Yup.string().required().label(form.foreheadBruise.label),
    [form.foreheadBruiseDetails.name]: Yup.string(),

    [form.chinLaceration.name]: Yup.string().required().label(form.chinLaceration.label),
    [form.chinLacerationLength.name]: Yup.string(),
    [form.chinLacerationDepth.name]: Yup.string(),
    [form.chinBruise.name]: Yup.string().required().label(form.chinBruise.label),
    [form.foreheadBruiseDetails.name]: Yup.string(),
    
    [form.lipsLaceration.name]: Yup.string().required().label(form.lipsLaceration.label),
    [form.lipsLacerationLength.name]: Yup.string(),
    [form.lipsLacerationDepth.name]: Yup.string(),
    [form.lipsBruise.name]: Yup.string().required().label(form.lipsBruise.label),
    [form.lipsBruiseDetails.name]: Yup.string(),

    [form.trachea.name]: Yup.string().required().label(form.trachea.label),
    [form.tracheaDeviation.name]: Yup.string(),
    [form.jugularVenousPressure.name]: Yup.string().required().label(form.trachea.label),
    [form.neckRaised.name]: Yup.string().required().label(form.neckRaised.label),
    [form.neckRaisedHeight.name]: Yup.string(),
    [form.enlargedThyroid.name]: Yup.string().required().label(form.enlargedThyroid.label),
    [form.neckHaematoma.name]: Yup.string().required().label(form.neckHaematoma.label),
    [form.lymphNodes.name]: Yup.string().required().label(form.lymphNodes.label),
    [form.lymphNodeLocation.name]: Yup.string(),
    [form.lymphNodeSize.name]: Yup.string(),
    [form.lymphNodeMobility.name]: Yup.string(),
    [form.lymphNodeTenderness.name]: Yup.string(),
    [form.neckLaceration.name]: Yup.string().required().label(form.neckLaceration.label),
    [form.neckLacerationLength.name]: Yup.string(),
    [form.neckLacerationDepth.name]: Yup.string(),
    [form.neckBruise.name]: Yup.string().required().label(form.neckBruise.label),
    [form.neckBruiseDetails.name]: Yup.string(),
    [form.neckAdditionalNotes.name]: Yup.string(),
    });

const PartsList = [
  { name: "Eyes", value: "Eyes" },
  { name: "Mouth", value: "Mouth" },
  { name: "Ears", value: "Ears" },
  { name: "Nose", value: "Nose" },
  { name: "Left Temporal", value: "Left Temporal" },
  { name: "Right Temporal", value: "Right Temporal" },
  { name: "Crown", value: "Crown" },
  { name: "Occiput", value: "Occiput" },
  { name: "Cheeks", value: "Cheeks" },
  { name: "Forehead", value: "Forehead" },
  { name: "Chin", value: "Chin" },
  { name: "Lips", value: "Lips" },
  { name: "Neck", value: "Neck" },
]

const initialValues = getInitialValues(form);


const pupilSizes = [
  { label: "constricted", value: "constricted" },
  { label: "normal", value: "normal" },
  { label: "dialated", value: "dialated" },
];

const yesOrNo = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" }
];

const EyesForm = ()=>{
  return(
    <>
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
          name={form.leftPupilSize.name}
          label={form.leftPupilSize.label}
          options={pupilSizes}
        />
        <RadioGroupInput
          name={form.rightPupilSize.name}
          label={form.rightPupilSize.label}
          options={pupilSizes}
        />
        </FieldsContainer>
        <RadioGroupInput
          name={form.eyePallor.name}
          label={form.eyePallor.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.juandice.name}
          label={form.juandice.label}
          options={yesOrNo}
        />
        <FormFieldContainerLayout title="Racoon Eyes">
        <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.racoonEyesLeftEye.name}
          label={form.racoonEyesLeftEye.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.racoonEyesRightEye.name}
          label={form.racoonEyesRightEye.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Hyphema">
        <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.hyphemaLeftEye.name}
          label={form.hyphemaLeftEye.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.hyphemaRightEye.name}
          label={form.hyphemaRightEye.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Eyelid injury">
        <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.eyelidLeftEye.name}
          label={form.eyelidLeftEye.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.eyelidRightEye.name}
          label={form.eyelidRightEye.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Other">
        <TextInputField
                  name={form.eyesOther.name}
                  label={form.eyesOther.label}
                  id={form.eyesOther.name}
                  disabled={false}
                  multiline={true}
                />
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Fundoscopy">
        <TextInputField
                  name={form.fundoscopy.name}
                  label={form.fundoscopy.label}
                  id={form.fundoscopy.name}
                  disabled={false}
                  multiline={true}
                />
        </FormFieldContainerLayout>
        </>
  )
};

const MouthForm = ()=>{
  return(
    <>
    <RadioGroupInput
          name={form.oralThrush.name}
          label={form.oralThrush.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.kaposisSarcomaLesions.name}
          label={form.kaposisSarcomaLesions.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.tongueLaceration.name}
          label={form.tongueLaceration.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.looseTeeth.name}
          label={form.looseTeeth.label}
          options={yesOrNo}
        />
    <TextInputField
                  name={form.mouthOther.name}
                  label={form.mouthOther.label}
                  id={form.eyesOther.name}
                  disabled={false}
                  multiline={true}
                />
  </>
  )
};

const EarForm = ()=>{

  const [lacerated, setLacerated] = useState(false);
  const [otoscopy, setOtoscopy]= useState(false);

  const handleLaceratedEar=(value: string)=>{ 
    setLacerated(false);
    
    if(value == 'yes'){
      setLacerated(true);
    }
  };

  const handleOtoscopy=(value: string)=>{ 
    setOtoscopy(false);
    
    if(value == 'yes'){
      setOtoscopy(true);
    }
  };

  return(
    <>
     <FormFieldContainerLayout title="Bleeding from the ear">
        <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.leftEarBleeding.name}
          label={form.leftEarBleeding.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.rightEarBleeding.name}
          label={form.rightEarBleeding.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
    <FormFieldContainerLayout title="Otorrhoea">
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
          name={form.leftEarOtorrhoea.name}
          label={form.leftEarOtorrhoea.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.rightEarOtorrhoea.name}
          label={form.rightEarOtorrhoea.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Laceration">
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
    getValue={handleLaceratedEar}
          name={form.leftEarLaceration.name}
          label={form.leftEarLaceration.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          getValue={handleLaceratedEar}
          name={form.rightEarLaceration.name}
          label={form.rightEarLaceration.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        {lacerated &&
        <TextInputField
                  name={form.earlacerationDetails.name}
                  label={form.earlacerationDetails.label}
                  id={form.earlacerationDetails.name}
                  disabled={false}
                  multiline={true}
                />}
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Otoscopy">
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
    getValue={handleOtoscopy}
          name={form.leftEarOtoscopy.name}
          label={form.leftEarOtoscopy.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          getValue={handleOtoscopy}
          name={form.rightEarOtoscopy.name}
          label={form.rightEarOtoscopy.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        {otoscopy &&
        <TextInputField
                  name={form.otoscopyDetails.name}
                  label={form.otoscopyDetails.label}
                  id={form.otoscopyDetails.name}
                  disabled={false}
                  multiline={true}
                />}
        </FormFieldContainerLayout>
        </>
  )};

const NoseForm =()=>{
  const [lacerated, setLacerated] = useState(false);

  const handleLaceratedNose=(value: string)=>{ 
    setLacerated(false);
    
    if(value == 'yes'){
      setLacerated(true);
    }
  };
  return(
    <>
    <RadioGroupInput
          name={form.noseBleed.name}
          label={form.noseBleed.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.rhinorrhoea.name}
          label={form.rhinorrhoea.label}
          options={yesOrNo}
        />
        <RadioGroupInput
        getValue={handleLaceratedNose}
          name={form.noseLaceration.name}
          label={form.noseLaceration.label}
          options={yesOrNo}
        />
        {lacerated &&
        <TextInputField
                  name={form.noseLacerationDetails.name}
                  label={form.noseLacerationDetails.label}
                  id={form.noseLacerationDetails.name}
                  disabled={false}
                  multiline={true}
                />}
        
    </>
  )
};

const OtherForm =({
  lacerationLabel,
  lacerationName,
  lacerationDepthLabel,
  lacerationDepthName,
  lacerationLengthLabel,
  lacerationLengthName,
  bruiseLabel,
  bruiseName,
  bruiseDetailsLabel,
  bruiseDetailsName,
  haematomaLabel,
  haematomaName,
  fractureLabel,
  fractureName,
  otherLabel,
  otherName,
}: {
  lacerationLabel: string;
  lacerationName: string;
  lacerationDepthLabel: string;
  lacerationDepthName: string;
  lacerationLengthLabel: string;
  lacerationLengthName: string;
  bruiseLabel: string;
  bruiseName: string;
  bruiseDetailsLabel: string;
  bruiseDetailsName: string;
  haematomaLabel: string;
  haematomaName: string;
  fractureLabel: string;
  fractureName: string;
  otherLabel: string;
  otherName: string;
})=>{
  const [lacerated, setLacerated] = useState(false);
  const [bruised, setBruised] = useState(false);

  const handleLacerated=(value: string)=>{ 
    setLacerated(false);
    
    if(value == 'yes'){
      setLacerated(true);
    }
  };

  const handleBruised=(value: string)=>{ 
    setBruised(false);
    
    if(value == 'yes'){
      setBruised(true);
    }
  };
  return(
    <>
    <FormFieldContainerLayout title={lacerationLabel}>
        <RadioGroupInput
        getValue={handleLacerated}
          name={lacerationName}
          label={lacerationLabel}
          options={yesOrNo}
        />
        {lacerated &&
        <div>
        <TextInputField
                  name={lacerationDepthName}
                  label={lacerationDepthLabel}
                  id={lacerationDepthName}
                  disabled={false}
                  multiline={false}
                  unitOfMeasure="mm"
                />
                <TextInputField
                  name={lacerationLengthName}
                  label={lacerationLengthLabel}
                  id={lacerationLengthName}
                  disabled={false}
                  multiline={false}
                  unitOfMeasure="mm"
                /></div>}
    </FormFieldContainerLayout>
    <FormFieldContainerLayout title={bruiseLabel}>
        <RadioGroupInput
        getValue={handleBruised}
          name={bruiseName}
          label={bruiseLabel}
          options={yesOrNo}
        />
        {bruised &&
        <TextInputField
                  name={bruiseDetailsName}
                  label={bruiseDetailsLabel}
                  id={bruiseDetailsName}
                  disabled={false}
                  multiline={false}
                />
             }
    </FormFieldContainerLayout>
 
    <RadioGroupInput
          name={haematomaName}
          label={haematomaLabel}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={fractureName}
          label={fractureLabel}
          options={yesOrNo}
        />
        <FormFieldContainerLayout title={otherLabel}>
<TextInputField
                  name={otherName}
                  label=""
                  id={otherName}
                  disabled={false}
                  multiline={true}
                />
                </FormFieldContainerLayout>
                
    </>
  )
};

const FacialInjuriesForm = ({
  lacerationLabel,
  lacerationName,
  lacerationDepthLabel,
  lacerationDepthName,
  lacerationLengthLabel,
  lacerationLengthName,
  bruiseLabel,
  bruiseName,
  bruiseDetailsLabel,
  bruiseDetailsName,
}: {
  lacerationLabel: string;
  lacerationName: string;
  lacerationDepthLabel: string;
  lacerationDepthName: string;
  lacerationLengthLabel: string;
  lacerationLengthName: string;
  bruiseLabel: string;
  bruiseName: string;
  bruiseDetailsLabel: string;
  bruiseDetailsName: string;
}) => {
  const [lacerated, setLacerated] = useState(false);
  const [bruised, setBruised] = useState(false);

  const handleLacerated = (value: string) => {
    setLacerated(false);

    if (value === 'yes') {
      setLacerated(true);
    }
  };

  const handleBruised = (value: string) => {
    setBruised(false);

    if (value === 'yes') {
      setBruised(true);
    }
  };

  return (
    <>
      <FormFieldContainerLayout title={lacerationLabel}>
        <RadioGroupInput
          getValue={handleLacerated}
          name={lacerationName}
          label={lacerationLabel}
          options={yesOrNo}
        />
        {lacerated && (
          <div>
            <TextInputField
              name={lacerationDepthName}
              label={lacerationDepthLabel}
              id={lacerationDepthName}
              disabled={false}
              multiline={false}
              unitOfMeasure="mm"
            />
            <TextInputField
              name={lacerationLengthName}
              label={lacerationLengthLabel}
              id={lacerationLengthName}
              disabled={false}
              multiline={false}
              unitOfMeasure="mm"
            />
          </div>
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title={bruiseLabel}>
        <RadioGroupInput
          getValue={handleBruised}
          name={bruiseName}
          label={bruiseLabel}
          options={yesOrNo}
        />
        {bruised && (
          <TextInputField
            name={bruiseDetailsName}
            label={bruiseDetailsLabel}
            id={bruiseDetailsName}
            disabled={false}
            multiline={false}
          />
        )}
      </FormFieldContainerLayout>
    </>
  );
};

const NeckForm = ()=>{

  const [deviated, setDeviated] = useState(false);
  const [raised, setRaised] = useState(false);
  const [lymphNodes, setLymphNodes] = useState(false);
  const [lacerated, setLacerated] = useState(false);
  const [bruised, setBruised] = useState(false);

  const handleLacerated = (value: string) => {
    setLacerated(false);

    if (value === 'yes') {
      setLacerated(true);
    }
  };

  const handleBruised = (value: string) => {
    setBruised(false);

    if (value === 'yes') {
      setBruised(true);
    }
  };

  const handleTrachea=(value:string)=>{

    setDeviated(false);
    if (value === 'deviated') {
      setDeviated(true);
    }
  };

  const handleNeckRaised=(value:string)=>{

    setRaised(false);
    if (value === 'yes') {
      setRaised(true);
    }
  };

  const handleLymphNodes=(value:string)=>{

    setLymphNodes(false);

    if (value === 'yes') {
      setLymphNodes(true);
    }
  };


  return (
    <>
    <FormFieldContainerLayout title={form.trachea.label}>
  <RadioGroupInput
          getValue={handleTrachea}
          name={form.trachea.name}
          label={form.trachea.label}
          options={[
            { label: "Central", value: "central" },
            { label: "Deviated", value: "deviated" },]}
        />
        {deviated &&(
          <RadioGroupInput
          name={form.tracheaDeviation.name}
          label={form.tracheaDeviation.label}
          options={[
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },]}
        />
        )}
        </FormFieldContainerLayout>
        <TextInputField
            name={form.jugularVenousPressure.name}
            label={form.jugularVenousPressure.label}
            id={form.jugularVenousPressure.id}
            disabled={false}
            multiline={false}
            unitOfMeasure='cm'
          />
          <FormFieldContainerLayout title={form.neckRaised.label}>
          <RadioGroupInput
          getValue={handleNeckRaised}
          name={form.neckRaised.name}
          label={form.neckRaised.label}
          options={yesOrNo}
        /> {raised &&(
          <TextInputField
          name={form.neckRaisedHeight.name}
          label={form.neckRaisedHeight.label}
          id={form.neckRaisedHeight.id}
          disabled={false}
          multiline={false}
          unitOfMeasure='cm'
        />
        )}
        </FormFieldContainerLayout>
         <RadioGroupInput
          name={form.enlargedThyroid.name}
          label={form.enlargedThyroid.label}
          options={yesOrNo}
        /> 
        <TextInputField
            name={form.neckHaematoma.name}
            label={form.neckHaematoma.label}
            id={form.neckHaematoma.id}
            disabled={false}
            multiline={true}
          />
          <FormFieldContainerLayout title={form.lymphNodes.label}>
          <RadioGroupInput
          getValue={handleLymphNodes}
          name={form.lymphNodes.name}
          label={form.lymphNodes.label}
          options={yesOrNo}
        /> {lymphNodes &&(
          <div>
          <TextInputField
          name={form.lymphNodeLocation.name}
          label={form.lymphNodeLocation.label}
          id={form.lymphNodeLocation.id}
          disabled={false}
          multiline={true}
        />
          <TextInputField
          name={form.lymphNodeSize.name}
          label={form.lymphNodeSize.label}
          id={form.lymphNodeSize.id}
          disabled={false}
          multiline={false}
          unitOfMeasure='cm'
        />
        <TextInputField
          name={form.lymphNodeMobility.name}
          label={form.lymphNodeMobility.label}
          id={form.lymphNodeMobility.id}
          disabled={false}
          multiline={true}
        />
        <TextInputField
          name={form.lymphNodeTenderness.name}
          label={form.lymphNodeTenderness.label}
          id={form.lymphNodeTenderness.id}
          disabled={false}
          multiline={true}
        />
        </div>)}
        </FormFieldContainerLayout>

        <FormFieldContainerLayout title={form.neckLaceration.label}>
        <RadioGroupInput
          getValue={handleLacerated}
          name={form.neckLaceration.name}
          label={form.neckLaceration.label}
          options={yesOrNo}
        />
        {lacerated && (
          <div>
            <TextInputField
              name={form.neckLacerationLength.name}
              label={form.neckLacerationLength.label}
              id={form.neckLacerationLength.id}
              disabled={false}
              multiline={false}
              unitOfMeasure="mm"
            />
            <TextInputField
              name={form.neckLacerationDepth.name}
              label={form.neckLacerationDepth.label}
              id={form.neckLacerationDepth.id}
              disabled={false}
              multiline={false}
              unitOfMeasure="mm"
            />
          </div>
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title={form.neckBruise.label}>
        <RadioGroupInput
          getValue={handleBruised}
          name={form.neckBruise.name}
          label={form.neckBruise.label}
          options={yesOrNo}
        />
        {bruised && (
          <TextInputField
            name={form.neckBruiseDetails.name}
            label={form.neckBruiseDetails.label}
            id={form.neckBruiseDetails.id}
            disabled={false}
            multiline={false}
          />
        )}
        </FormFieldContainerLayout>
   </>     
  )
};


export const HeadAndNeckForm = ({onSubmit}: Prop) => {

  const [selectedPart, setSelectedPart] = useState('');


  const handleValueChange = (value: string)=>{
    if(value){
    setSelectedPart(value);
    console.log(selectedPart);
    }
  }

  const renderFormFields = () => {
    if(selectedPart){
    switch (selectedPart) {
      case 'Eyes':
        return (
          <EyesForm/>
        );
      case 'Mouth':
        return (
        <MouthForm/>
        );
      case 'Ears':
        return (
        <EarForm/>
        );
      case 'Nose':
        return (
        <NoseForm/>
        );
        case 'Left Temporal':
        return (
        <OtherForm lacerationLabel={form.leftTemporalLaceration.label}
        lacerationName={form.leftTemporalLaceration.name}
        lacerationDepthLabel={form.leftTemporalLacerationDepth.label}
        lacerationDepthName={form.leftTemporalLacerationDepth.name}
        lacerationLengthLabel={form.leftTemporalLacerationLength.label}
        lacerationLengthName={form.leftTemporalLacerationLength.name}
        bruiseLabel={form.leftTemporalBruise.label}
        bruiseName={form.leftTemporalBruise.name}
        bruiseDetailsLabel={form.leftTemporalBruiseDetails.label}
        bruiseDetailsName={form.leftTemporalBruiseDetails.name}
        haematomaLabel={form.leftTemporalHaematoma.label}
        haematomaName={form.leftTemporalHaematoma.name}
        fractureLabel={form.leftTemporalFracture.label}
        fractureName={form.leftTemporalFracture.name}
        otherLabel={form.leftTemporalOther.label}
        otherName={form.leftTemporalOther.name} />
        );
        case 'Right Temporal':
  return (
    <OtherForm
      lacerationLabel={form.rightTemporalLaceration.label}
      lacerationName={form.rightTemporalLaceration.name}
      lacerationDepthLabel={form.rightTemporalLacerationDepth.label}
      lacerationDepthName={form.rightTemporalLacerationDepth.name}
      lacerationLengthLabel={form.rightTemporalLacerationLength.label}
      lacerationLengthName={form.rightTemporalLacerationLength.name}
      bruiseLabel={form.rightTemporalBruise.label}
      bruiseName={form.rightTemporalBruise.name}
      bruiseDetailsLabel={form.rightTemporalBruiseDetails.label}
      bruiseDetailsName={form.rightTemporalBruiseDetails.name}
      haematomaLabel={form.rightTemporalHaematoma.label}
      haematomaName={form.rightTemporalHaematoma.name}
      fractureLabel={form.rightTemporalFracture.label}
      fractureName={form.rightTemporalFracture.name}
      otherLabel={form.rightTemporalOther.label}
      otherName={form.rightTemporalOther.name}
    />
  );

case 'Occiput':
  return (
    <OtherForm
      lacerationLabel={form.occiputLaceration.label}
      lacerationName={form.occiputLaceration.name}
      lacerationDepthLabel={form.occiputLacerationDepth.label}
      lacerationDepthName={form.occiputLacerationDepth.name}
      lacerationLengthLabel={form.occiputLacerationLength.label}
      lacerationLengthName={form.occiputLacerationLength.name}
      bruiseLabel={form.occiputBruise.label}
      bruiseName={form.occiputBruise.name}
      bruiseDetailsLabel={form.occiputBruiseDetails.label}
      bruiseDetailsName={form.occiputBruiseDetails.name}
      haematomaLabel={form.occiputHaematoma.label}
      haematomaName={form.occiputHaematoma.name}
      fractureLabel={form.occiputFracture.label}
      fractureName={form.occiputFracture.name}
      otherLabel={form.occiputOther.label}
      otherName={form.occiputOther.name}
    />
  );

case 'Crown':
  return (
    <OtherForm
      lacerationLabel={form.crownLaceration.label}
      lacerationName={form.crownLaceration.name}
      lacerationDepthLabel={form.crownLacerationDepth.label}
      lacerationDepthName={form.crownLacerationDepth.name}
      lacerationLengthLabel={form.crownLacerationLength.label}
      lacerationLengthName={form.crownLacerationLength.name}
      bruiseLabel={form.crownBruise.label}
      bruiseName={form.crownBruise.name}
      bruiseDetailsLabel={form.crownBruiseDetails.label}
      bruiseDetailsName={form.crownBruiseDetails.name}
      haematomaLabel={form.crownHaematoma.label}
      haematomaName={form.crownHaematoma.name}
      fractureLabel={form.crownFracture.label}
      fractureName={form.crownFracture.name}
      otherLabel={form.crownOther.label}
      otherName={form.crownOther.name}
    />
  );
  case 'Cheeks':
  return (
    <FacialInjuriesForm
      lacerationLabel={form.cheeksLaceration.label}
      lacerationName={form.cheeksLaceration.name}
      lacerationDepthLabel={form.cheeksLacerationDepth.label}
      lacerationDepthName={form.cheeksLacerationDepth.name}
      lacerationLengthLabel={form.cheeksLacerationLength.label}
      lacerationLengthName={form.cheeksLacerationLength.name}
      bruiseLabel={form.cheeksBruise.label}
      bruiseName={form.cheeksBruise.name}
      bruiseDetailsLabel={form.cheeksBruiseDetails.label}
      bruiseDetailsName={form.cheeksBruiseDetails.name}
      />
      );
      case 'Forehead':
  return (
    <FacialInjuriesForm
      lacerationLabel={form.foreheadLaceration.label}
      lacerationName={form.foreheadLaceration.name}
      lacerationDepthLabel={form.foreheadLacerationDepth.label}
      lacerationDepthName={form.foreheadLacerationDepth.name}
      lacerationLengthLabel={form.foreheadLacerationLength.label}
      lacerationLengthName={form.foreheadLacerationLength.name}
      bruiseLabel={form.foreheadBruise.label}
      bruiseName={form.foreheadBruise.name}
      bruiseDetailsLabel={form.foreheadBruiseDetails.label}
      bruiseDetailsName={form.foreheadBruiseDetails.name}
      />
      );
      case 'Chin':
  return (
    <FacialInjuriesForm
      lacerationLabel={form.chinLaceration.label}
      lacerationName={form.chinLaceration.name}
      lacerationDepthLabel={form.chinLacerationDepth.label}
      lacerationDepthName={form.chinLacerationDepth.name}
      lacerationLengthLabel={form.chinLacerationLength.label}
      lacerationLengthName={form.chinLacerationLength.name}
      bruiseLabel={form.chinBruise.label}
      bruiseName={form.chinBruise.name}
      bruiseDetailsLabel={form.chinBruiseDetails.label}
      bruiseDetailsName={form.chinBruiseDetails.name}
      />
      );
      case 'Lips':
  return (
    <FacialInjuriesForm
      lacerationLabel={form.lipsLaceration.label}
      lacerationName={form.lipsLaceration.name}
      lacerationDepthLabel={form.lipsLacerationDepth.label}
      lacerationDepthName={form.lipsLacerationDepth.name}
      lacerationLengthLabel={form.lipsLacerationLength.label}
      lacerationLengthName={form.lipsLacerationLength.name}
      bruiseLabel={form.lipsBruise.label}
      bruiseName={form.lipsBruise.name}
      bruiseDetailsLabel={form.lipsBruiseDetails.label}
      bruiseDetailsName={form.lipsBruiseDetails.name}
      />
      );
      case 'Neck':
        return (
          <NeckForm/>
        )
        break;
      default:
        return null;
    }
  }
  };

  return (
    <>
  <FormikInit
    validationSchema={null}//{schema}
    initialValues={initialValues}
    onSubmit={onSubmit}
    submitButtonText="next"
    submitButton={true}
  >
  <FormFieldContainerLayout last={false} title="Parts">
  <SelectInputField
  getValue={handleValueChange}
  name="options"
  label="part"
  selectItems={PartsList} id={'selectParts'}      />
          {renderFormFields()}
      </FormFieldContainerLayout>
  </FormikInit>
  
  </>
  );
};

