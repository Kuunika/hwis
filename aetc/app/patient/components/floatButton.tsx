import React, { useState, useEffect, useRef } from "react";
import { Fab, Box, ListItemText, ListItemButton } from "@mui/material";
import { FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Collapse from "@mui/material/Collapse";
import Link from "next/link"; // Use Link for routing (Next.js)

interface MenuItem {
  label: string;
  link?: string;
  icon?: React.ReactNode;
  submenu?: MenuItem[]; // Submenu items, if any
}

interface FloatingMenuProps {
  menuItems: MenuItem[]; // Array of menu items with optional submenus
  position?: { bottom?: number; right?: number }; // Position of the button and menu
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  menuItems,
  position = { bottom: 16, right: 16 },
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const menuRef = useRef<HTMLElement | null>(null); // Ref for the menu container

  // Open and close handlers for the main menu
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
    setExpandedItem(null);
  };

  const toggleExpand = (item: string) => {
    setExpandedItem((prev) => (prev === item ? null : item));
  };

  const isMenuOpen = Boolean(menuAnchorEl);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render menu items recursively
  const renderMenuItems = (items: MenuItem[], parentKey: string = "") => {
    return items.map((item, index) => {
      const key = `${parentKey}-${index}`;
      const isExpanded = expandedItem === key;

      // If no submenu, render a direct link
      if (!item.submenu) {
        return item.link ? (
          <Link href={item.link} key={key} passHref>
            <ListItemButton style={menuItemStyle}>
              {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ) : null;
      }

      // If submenu exists, render with expandable functionality
      return (
        <Box key={key}>
          <ListItemButton
            onClick={() => toggleExpand(key)}
            style={menuItemStyle}
          >
            {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
            <ListItemText primary={item.label} />
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </ListItemButton>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: "1.5rem" }}>
              {renderMenuItems(item.submenu, key)}
            </Box>
          </Collapse>
        </Box>
      );
    });
  };
  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={openMenu}
        style={{
          position: "fixed",
          bottom: position.bottom,
          right: position.right,
        }}
      >
        <FiPlus size={24} />
      </Fab>

      {/* Custom Menu */}
      <Box
        ref={menuRef} // Attach ref here
        sx={{
          display: isMenuOpen ? "block" : "none",
          position: "absolute",
          bottom: 80, // Adjusted position relative to the button
          right: 16,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          transition: "width 0.3s ease-in-out",
          width: expandedItem ? "300px" : "200px", // Dynamic width
        }}
      >
        {renderMenuItems(menuItems)} {/* Render the menu items */}
      </Box>
    </>
  );
};

const menuItemStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
};

export default FloatingMenu;
