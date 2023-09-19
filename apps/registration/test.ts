export default [
  {
    name: "New Patient Registration ",
    fragments: [
      {
        fragmentName: "Demographics",
        id: "4795c7ef-0c58-49f8-adec-d6f01dfba9fe",
        active: false,
        formDataElements: [
          {
            label: "First Name",
            type: "text",
            dataElement: "firstName",
            dataType: "text",
            rules: [],
            id: "d7c7d2e7-fc91-418d-bfac-19b13ab88083",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Last Name",
            type: "text",
            dataElement: "lastName",
            dataType: "text",
            rules: [],
            id: "fa13d8d3-cc52-461b-9fa2-42c6ac5188a6",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Identification Number",
            type: "text",
            dataElement: "identificationNumber",
            dataType: "text",
            rules: [],
            id: "6a1d4d7e-ef99-4fde-9398-23b1071a6854",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Gender",
            type: "radio",
            dataElement: "gender",
            dataType: "text",
            rules: [],
            id: "eda895a6-b41a-401c-b311-0323cf901f79",
            validations: [
              {
                rule: "isRequired",
                value: "0",
              },
            ],
            isVisible: "1",
            optionSetId: "religion",
          },
          {
            label: "Current District",
            type: "select",
            dataElement: "currentDiStrict",
            dataType: "text",
            rules: [],
            id: "87e2e037-cdc5-4701-84fa-9feabcbe0ac2",
            validations: [
              {
                rule: "isRequired",
                value: "0",
              },
            ],
            isVisible: "1",
            optionSetId: "districts",
          },
          {
            label: "Current Traditional Authority",
            type: "text",
            dataElement: "currentTA",
            dataType: "text",
            rules: [],
            id: "901e0707-fa15-48a4-88e6-4f538da416fa",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Current Village",
            type: "text",
            dataElement: "currentVillage",
            dataType: "text",
            rules: [],
            id: "d8880601-9afb-4b19-a4f8-09af3185cf42",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Closet Land Mark",
            type: "text",
            dataElement: "closestLandMark",
            dataType: "text",
            rules: [],
            id: "525b77f0-b2a8-473e-b080-b4fb81da0c9e",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Next Of Kin Name",
            type: "text",
            dataElement: "nextOfKinName",
            dataType: "text",
            rules: [],
            id: "57737c65-5808-4de8-9d72-b9a0cf02f3b8",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Next Of Relationship",
            type: "text",
            dataElement: "nextOfRelationship",
            dataType: "text",
            rules: [],
            id: "878edf91-ccf0-433b-b37f-a0d211e73687",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Home District",
            type: "select",
            dataElement: "homeDistrict",
            dataType: "text",
            rules: [],
            id: "769500eb-239c-491e-af05-8d2fd2573aaa",
            validations: [
              {
                rule: "isRequired",
                value: "0",
              },
            ],
            isVisible: "1",
            optionSetId: "districts",
          },
        ],
      },
      {
        fragmentName: "Social History",
        dataElements: [
          {
            id: "maritalStatus",
            label: "Marital Status",
          },
          {
            id: "occupationStatus",
            label: "OccupationStatus",
          },
          {
            id: "methodOfTransportation",
            label: "Method Of Transportation",
          },
          {
            id: "religion",
            label: "Religion",
          },
          {
            id: "highestEducation",
            label: "Highest Education",
          },
        ],
        id: "e666fab0-1683-4177-850d-b3922c2b9156",
        active: false,
        formDataElements: [
          {
            label: "Marital Status",
            type: "select",
            dataElement: "maritalStatus",
            dataType: "text",
            rules: [],
            id: "5712fa85-e7c8-4622-ad08-be8797e9a1f6",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "maritalStatus",
          },
          {
            label: "Occupation Status",
            type: "select",
            dataElement: "occupationStatus",
            dataType: "text",
            rules: [],
            id: "ffa4c45f-c9cd-475a-9a1f-f8d618c3597e",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "occupationStatus",
          },
          {
            label: "Method Of Transportation",
            type: "text",
            dataElement: "methodOfTransportation",
            dataType: "text",
            rules: [],
            id: "40c47015-9ac1-4d00-8628-400d8ee18cfa",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Religion",
            type: "select",
            dataElement: "religion",
            dataType: "text",
            rules: [],
            id: "a7c938e5-d7d8-43f5-b591-c36844bb3ec0",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
        ],
      },
      {
        fragmentName: "Referral",
        dataElements: [
          {
            id: "healthFacility",
            label: "Health Facility",
          },
        ],
        id: "f9149507-d015-4dee-b419-21db876d1c16",
        active: false,
        formDataElements: [
          {
            label: "Referral Hospital",
            type: "select",
            dataElement: "healthFacility",
            dataType: "text",
            rules: [],
            id: "80bcac34-63d7-4d66-96be-ecadec04a006",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "healthFacilities",
          },
        ],
      },
      {
        fragmentName: "Financing",
        dataElements: [
          {
            id: "insuranceProvider",
            label: "Insurance Provider",
          },
          {
            id: "patientInsuranceId",
            label: "Patient Insurance Id",
          },
          {
            id: "modeOfPayment",
            label: "Mode Of Payment",
          },
          {
            id: "insuranceSchema",
            label: "Insurance Schema ",
          },
        ],
        id: "356757ac-87ec-46c5-a324-dae3d8c58fb4",
        active: true,
        formDataElements: [
          {
            label: "Mode Of Payment",
            type: "select",
            dataElement: "modeOfPayment",
            dataType: "text",
            rules: [],
            id: "0294bccb-f56d-4a64-8132-c65c463e7f00",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "modeOfPayment",
          },
          {
            label: "Insurance Provider",
            type: "text",
            dataElement: "insuranceProvider",
            dataType: "text",
            rules: [],
            id: "0bfe456e-5a73-40b9-816f-a4c7a1b09732",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
          {
            label: "Insurance Schema",
            type: "select",
            dataElement: "insuranceSchema",
            dataType: "text",
            rules: [],
            id: "e9826878-fd1d-4fd2-9f28-fe2253b0f1f8",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "insuranceSchema",
          },
          {
            label: "Patient Id",
            type: "text",
            dataElement: "patientInsuranceId",
            dataType: "text",
            rules: [],
            id: "df3d660a-9d64-4905-ad43-f943b8d041cf",
            validations: [
              {
                rule: "isRequired",
                value: "1",
              },
            ],
            isVisible: "1",
            optionSetId: "",
          },
        ],
      },
    ],
    id: 1,
  },
];
