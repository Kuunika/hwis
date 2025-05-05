"use client";

import React, { useState, useRef, useEffect } from "react";
import { InputLabel } from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { useSearchDiagnoses } from "../../hooks/diagnoses";

interface ICD11Entity {
  code: string;
  diagnosis: string;
}

interface OfflineICD11SelectionProps {
  label: string;
  onSelection?: (selectedEntity: ICD11Entity) => void;
  initialValue?: string;
  placeholder?: string;
}

/**
 * An offline-capable ICD-11 diagnosis selection component
 * that uses the useSearchDiagnoses hook instead of the ECT API
 */
const OfflineICD11Selection: React.FC<OfflineICD11SelectionProps> = ({
  label,
  onSelection,
  initialValue = "",
  placeholder = "Search for a diagnosis...",
}) => {
  // State for the input field
  const [inputValue, setInputValue] = useState("");
  // State to track if the results are visible
  const [showResults, setShowResults] = useState(false);
  // State to track if there's a selected diagnosis
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>(initialValue);
  // Reference to the results dropdown for click-outside detection
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use our search diagnoses hook which now returns formatted data
  const { data: searchResults, isLoading, isError } = useSearchDiagnoses(
    inputValue,
    60 * 60 * 1000 // 1 hour cache time
  );

  // Handle selection of a diagnosis
  const handleSelect = (entity: ICD11Entity) => {
    const diagnosisText = `${entity.diagnosis} - ${entity.code}`;
    setSelectedDiagnosis(diagnosisText);
    setShowResults(false);
    setInputValue("");
    
    if (onSelection) {
      onSelection(entity);
    }
  };

  // Handle clearing the selection
  const handleClear = () => {
    setSelectedDiagnosis("");
    setInputValue("");
    
    if (onSelection) {
      // Pass an empty entity to clear
      onSelection({ code: "", diagnosis: "" });
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (inputValue.length >= 3) {
      setShowResults(true);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowResults(value.length >= 3);
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="icd11-selection">
      <InputLabel
        sx={{ mb: "1ch", fontSize: "0.76rem", color: "text.secondary" }}
      >
        {label}
      </InputLabel>

      {selectedDiagnosis ? (
        <div 
          style={{ 
            backgroundColor: "white", 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            gap: '1rem', 
            borderRadius: "5px",
            border: '1px solid #e0e0e0',
            minHeight: '48px'
          }}
        >
          <label style={{ fontWeight: "bold" }}>
            {selectedDiagnosis}
          </label>
          <MdOutlineClose 
            color={"red"} 
            onClick={handleClear} 
            style={{ cursor: "pointer" }} 
          />
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%" }}>
          <IoSearch
            style={{
              position: "absolute",
              left: "10px",
              top: "40%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "gray",
            }}
          />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            style={{
              marginBottom: "1ch",
              paddingInline: "3.5ch",
              fontSize: ".96rem",
              color: "#333",
              height: "48px",
              width: "300px",
              borderRadius: "5px",
              border: '1px solid #e0e0e0',
              outline: 'none',
            }}
          />
          
          {showResults && (
            <div 
              ref={resultsRef}
              style={{
                position: "absolute",
                top: "calc(100% - 1ch)",
                left: 0,
                width: "100%",
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: "white",
                borderRadius: "5px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                zIndex: 9999,
                border: '1px solid #e0e0e0',
              }}
            >
              {isLoading ? (
                <div style={{ padding: "12px", textAlign: "center" }}>
                  Loading results...
                </div>
              ) : isError ? (
                <div style={{ padding: "12px", textAlign: "center", color: "red" }}>
                  Error loading results. Please try again.
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map((result: ICD11Entity, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(result)}
                    style={{
                      padding: "10px 12px",
                      borderBottom: index < searchResults.length - 1 ? "1px solid #f0f0f0" : "none",
                      cursor: "pointer",
                      display: "flex",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span style={{ fontWeight: "bold" }}>{result.code}</span>
                    <span>{result.diagnosis}</span>
                  </div>
                ))
              ) : inputValue.length >= 3 ? (
                <div style={{ padding: "12px", textAlign: "center" }}>
                  No results found
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineICD11Selection;