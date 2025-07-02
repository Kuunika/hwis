// utils/dataTransformer.ts
import { concepts } from "@/constants";
import { group } from "console";
const getFieldObsId = (fieldName: string, formDefinition: any) => {
  // Flatten all items from formDefinition
  const formItems = formDefinition.flatMap((section: any) =>
    section.items ? section.items : [section]
  );

  // Find the matching item
  const matchedItem = formItems.find((item: any) => item.name === fieldName);

  if (matchedItem && matchedItem.obs_id !== undefined) {
    return matchedItem.obs_id;
  }

  return null;
};
export const transformLabValues = (
  inputObj: any,
  formStructure: any,
  dateTime = new Date().toISOString()
) => {
  // Extract concept groups from the keys
  const groups: any = {};

  for (const key in inputObj) {
    // Split the key by underscore to get the group name and concept
    const [groupName, ...conceptParts] = key.split("_");
    const concept = conceptParts.join("_"); // Rejoin in case concept had underscores

    // Initialize group if it doesn't exist
    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    // Add the concept and value to the group
    groups[groupName].push({
      concept: concept || key,
      obsDatetime: dateTime,
      value: inputObj[key],
      groupMembers: [
        {
          concept: concepts.DESCRIPTION,
          obsDatetime: dateTime,
          value: getFieldObsId(key, formStructure),
        },
      ],
    });
  }

  // Create the final structure as an array of objects
  const result = [];

  for (const groupName in groups) {
    result.push({
      concept: concepts.DESCRIPTION || "DESCRIPTION",
      obsDatetime: dateTime,
      value: groupName,
      groupMembers: groups[groupName],
    });
  }

  return result;
};
