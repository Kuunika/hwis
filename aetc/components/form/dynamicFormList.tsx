import React from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa";

interface DynamicFormListProps<T> {
  items: T[];
  addItem: () => void;
  removeItem: (index: number) => void;
  renderFields: (item: T, index: number) => JSX.Element;
  headings: string[];
}

function DynamicFormList<T>({ items, addItem, removeItem, renderFields, headings }: DynamicFormListProps<T>) {
  return (
    <Table>
      <TableHead>
        {/* Customize Table Headers */}
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
                onClick={() => removeItem(index)}
                color="error"
              >
                <FaMinus />
              </IconButton>
              {index === items.length - 1 && (
                <IconButton onClick={addItem} color="primary">
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