export default {
  id: "1",
  name: "patient registration",
  formFragments: [
    {
      id: "1",
      formId: "1",
      fragmentName: "Demographics",
      order: 0,
      dataElements: [
        {
          id: "1",
          formFragmentId: "1",
          dataElementId: "1",
          dataElement: {
            name: "test",
          },
          type: "number",
          label: "bp",
          order: 0,
          show: true,
          validations: [
            {
              required: true,
            },
          ],
          rules: [
            {
              id: "1",
              formDataElementId: "1",
              operator: "=",
              value: "12",
              routeTo: "2",
            },
            {
              id: "2",
              formDataElementId: "1",
              operator: ">",
              value: "12",
              routeTo: "3",
            },
          ],
        },
        {
          id: "2",
          formFragmentId: "1",
          dataElementId: "2",
          dataElement: {
            name: "test2",
          },
          type: "number",
          order: 0,
          validations: [
            {
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
