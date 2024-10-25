import React from "react";
import { Box, IconButton } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa";

interface DynamicFormListProps<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>; // New prop to set the items list
  newItem: T; // A template for a new item
  renderFields: (item: T, index: number) => JSX.Element;
}

function DynamicFormList<T>({
  items,
  setItems,
  newItem,
  renderFields,

}: DynamicFormListProps<T>) {

  // Add a new item to the list
  function handleAddItem(): void {
    setItems([...items, newItem]);
  }

  // Remove an item from the list
  function handleRemoveItem(index: number): void {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column', // Arrange each item vertically
      gap: 2, // Space between items
      '@media (max-width: 1000px)': {
        flexDirection: 'column', // Stack items vertically on small screens
      }
    }}>

      {/* Render Dynamic Form Items */}
      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Render Dynamic Fields */}
          {renderFields(item, index)}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              disabled={index === 0}
              onClick={() => handleRemoveItem(index)}
              color="error"
            >
              <FaMinus />
            </IconButton>
            {index === items.length - 1 && (
              <IconButton onClick={handleAddItem} color="primary">
                <FaPlus />
              </IconButton>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default DynamicFormList;