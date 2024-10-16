import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa";

interface DynamicFormListProps<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>; // New prop to set the items list
  newItem: T; // A template for a new item
  renderFields: (item: T, index: number) => JSX.Element;
  headings: string[];
}

function DynamicFormList<T>({
  items,
  setItems,
  newItem,
  renderFields,
  headings,
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
    <Table>
      <TableHead>
        <TableRow>
          {headings.map((heading, idx) => (
            <TableCell key={idx} sx={{ textAlign: 'left' }}>
              {heading}
            </TableCell>
          ))}
          <TableCell sx={{ width: '10%', textAlign: 'left' }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            {/* Render Dynamic Fields */}
            {renderFields(item, index)}

            {/* Action Buttons */}
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DynamicFormList;