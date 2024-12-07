import React, { useState, useEffect, useRef } from "react";
import { Fab, Box, ListItemText, ListItemButton } from "@mui/material";
import { FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Collapse from "@mui/material/Collapse";
import Link from "next/link";

interface MenuItem {
  label: string;
  link?: string;
  icon?: React.ReactNode;
  id?: any;
  submenu?: MenuItem[];
}

interface FloatingMenuProps {
  menuItems: MenuItem[];
  position?: { bottom?: number; right?: number };
  onClickAction: (arg: any) => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  menuItems,
  position = { bottom: 16, right: 16 },
  onClickAction,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const menuRef = useRef<HTMLElement | null>(null);

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

  const renderMenuItems = (items: MenuItem[], parentKey: string = "") => {
    return items.map((item, index) => {
      const key = `${parentKey}-${index}`;
      const isExpanded = expandedItem === key;

      if (!item.submenu) {
        return item.link ? (
          <Link href={item.link} key={key} passHref>
            <ListItemButton
              onClick={() => item.id && onClickAction(item.id)}
              style={menuItemStyle}
            >
              {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ) : null;
      }

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

      <Box
        ref={menuRef}
        sx={{
          display: isMenuOpen ? "block" : "none",
          position: "absolute",
          bottom: 80,
          right: 16,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          transition: "width 0.3s ease-in-out",
          width: expandedItem ? "300px" : "200px",
        }}
      >
        {renderMenuItems(menuItems)}
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
  zIndex: 1000,
};

export default FloatingMenu;
