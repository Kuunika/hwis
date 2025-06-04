// hooks/useBedsideFormData.ts
import { useEffect, useState, useCallback } from "react";
import * as yup from "yup";
import { getValidationConfig } from "@/config/validationConfig";
import { processObservations } from "@/utils/observationProcessor";

export const useBedsideFormData = (
  encounterData: any,
  BedSideResults: any,
  bedsideLoading: boolean
) => {
  const [formStructure, setFormStructure] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState(yup.object());

  // Function to recursively collect all values from nested children
  const collectValuesFromChildren = useCallback((children: any) => {
    const values: any[] = [];

    if (!children || !Array.isArray(children)) return values;

    for (const child of children) {
      // Add current child's value if it exists
      if (child.value || child.value_text) {
        values.push(child.value || child.value_text);
      }

      // Recursively collect from nested children
      const nestedValues = collectValuesFromChildren(child.children);
      values.push(...nestedValues);
    }

    return values;
  }, []);

  // Function to get all obs_id values from the second array's nested structure
  const getObsIdsFromSecondArray = useCallback(
    (secondArray: any) => {
      const obsIds = new Set<number>(); // Use Set to avoid duplicates

      if (!secondArray || !Array.isArray(secondArray)) {
        return obsIds;
      }

      for (const obj of secondArray) {
        // Collect all values from nested children
        const values = collectValuesFromChildren(obj.children);

        // Convert string values to numbers and add to set
        values.forEach((value) => {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            obsIds.add(numValue);
          }
        });
      }

      return obsIds;
    },
    [collectValuesFromChildren]
  );

  // Recursive function to filter children and return filtered children array
  const filterChildren = useCallback(
    (children: any[], existingObsIds: Set<number>): any[] => {
      if (!children || !Array.isArray(children)) return [];

      const filteredChildren: any[] = [];

      for (const child of children) {
        // Check if current child should be kept (obs_id not in existing set)
        const shouldKeepChild = !existingObsIds.has(child.obs_id);

        if (shouldKeepChild) {
          // If child has nested children, recursively filter them
          if (child.children && Array.isArray(child.children)) {
            const filteredNestedChildren = filterChildren(
              child.children,
              existingObsIds
            );

            // Keep the child with filtered nested children
            filteredChildren.push({
              ...child,
              children: filteredNestedChildren,
            });
          } else {
            // Keep child as is if no nested children
            filteredChildren.push(child);
          }
        }
      }

      return filteredChildren;
    },
    []
  );

  // Main function to filter first array based on second array with nested filtering
  const filterFirstArrayUsingSecond = useCallback(
    (firstArray: any, secondArray: any) => {
      if (!firstArray || !Array.isArray(firstArray)) {
        return [];
      }
      if (!secondArray || !Array.isArray(secondArray)) {
        return firstArray;
      }

      // Get all obs_ids that exist as values in second array's nested children
      const existingObsIds = getObsIdsFromSecondArray(secondArray);

      const filtered: any[] = [];

      // Process each object in the first array
      for (const obj of firstArray) {
        const shouldKeepParent = !existingObsIds.has(obj.obs_id);

        // If parent should be removed, skip it entirely
        if (!shouldKeepParent) {
          continue;
        }

        // If object has children, filter them recursively
        if (obj.children && Array.isArray(obj.children)) {
          const filteredChildren = filterChildren(obj.children, existingObsIds);

          // If all children were filtered out, remove the parent object
          if (filteredChildren.length === 0 && obj.children.length > 0) {
            continue;
          }

          // Keep parent with filtered children
          filtered.push({
            ...obj,
            children: filteredChildren,
          });
        } else {
          // Keep parent object as is (no children to filter)
          filtered.push(obj);
        }
      }

      return filtered;
    },
    [getObsIdsFromSecondArray, filterChildren]
  );

  useEffect(() => {
    // Effect runs when BedSideResults or bedsideLoading changes
  }, [BedSideResults, bedsideLoading]);

  // Process the encounter data to build form structure
  useEffect(() => {
    if (encounterData && encounterData?.length > 0) {
      const structure: any = [];
      const values: any = {};
      const validationRules: any = {};
      const validationConfig = getValidationConfig();

      // Get latest encounter data
      const latestDatetime = encounterData[0]?.obs.reduce(
        (latest: any, item: any) => {
          return new Date(item.obs_datetime) > new Date(latest)
            ? item.obs_datetime
            : latest;
        },
        encounterData[0]?.obs[0]?.obs_datetime
      );

      const latestItems = encounterData[0]?.obs.filter(
        (item: any) => item.obs_datetime === latestDatetime
      );

      // Only filter if BedSideResults is available and not loading
      let itemsToProcess = latestItems;
      if (
        !bedsideLoading &&
        BedSideResults &&
        Array.isArray(BedSideResults) &&
        BedSideResults.length > 0
      ) {
        console.log("🚀 ~ useEffect ~ BedSideResults:", BedSideResults);
        itemsToProcess = filterFirstArrayUsingSecond(
          latestItems,
          BedSideResults[0].obs
        );
      }

      // Process all observations
      if (itemsToProcess && Array.isArray(itemsToProcess)) {
        itemsToProcess.forEach((obs) => {
          const processedObs = processObservations(
            obs,
            values,
            validationRules,
            validationConfig
          );
          if (processedObs) {
            structure.push(processedObs);
          }
        });
      }

      // Set form data
      setFormStructure(structure);
      setInitialValues(values);

      // Create validation schema
      try {
        if (Object.keys(validationRules).length > 0) {
          const schema = yup.object().shape(validationRules);
          setValidationSchema(schema);
        } else {
          setValidationSchema(yup.object());
        }
      } catch (error) {
        setValidationSchema(yup.object());
      }
    }
  }, [
    encounterData,
    BedSideResults,
    bedsideLoading,
    filterFirstArrayUsingSecond,
  ]);

  // Debug validation schema and initial values
  useEffect(() => {
    // Effect runs when validation schema or initial values change
  }, [validationSchema, initialValues]);

  return {
    formStructure,
    initialValues,
    validationSchema,
  };
};
