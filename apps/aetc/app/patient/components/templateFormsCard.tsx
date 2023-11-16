import Box from "@mui/material/Box";

import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { MainPaper, MainTypography } from "shared-ui/src";

export default function MenuTree() {
  const menuItems = [
    {
      id: "1",
      label: "AETC Form",
      children: [
        { id: "2", label: "Primary Assessment" },
        { id: " 3", label: "Secondary Assessment" },
      ],
    },
    {
      id: "4",
      label: "Medical Inpatient",
      children: [
        { id: "5", label: "Primary Assessment" },
        { id: " 6", label: "Secondary Assessment" },
      ],
    },
    {
      id: "7",
      label: "Surgical Notes",
      children: [
        { id: "8", label: "Primary Assessment" },
        { id: " 9", label: "Secondary Assessment" },
      ],
    },
    {
      id: "10",
      label: "Gynacological",
      children: [
        { id: "11", label: "Primary Assessment" },
        { id: " 12", label: "Secondary Assessment" },
      ],
    },
    {
      id: "13",
      label: "SOAP",
      children: [
        { id: "14", label: "Primary Assessment" },
        { id: " 15", label: "Secondary Assessment" },
      ],
    },
    {
      id: "16",
      label: "Monitoring Chart",
      children: [
        { id: "17", label: "Primary Assessment" },
        { id: " 18", label: "Secondary Assessment" },
      ],
    },
    {
      id: "19",
      label: "Referral",
      children: [
        { id: "20", label: "Primary Assessment" },
        { id: "21", label: "Secondary Assessment" },
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="template/forms"
        defaultCollapseIcon={<FaAngleDown />}
        defaultExpandIcon={<FaAngleRight />}
      >
        {menuItems.map((item) => {
          return (
            <TreeItem
              sx={{ py: "1ch" }}
              key={item.id}
              nodeId={item.id}
              label={item.label}
            >
              {item.children.map((child) => (
                <TreeItem
                  key={child.id}
                  nodeId={child.id}
                  label={child.label}
                />
              ))}
            </TreeItem>
          );
        })}
      </TreeView>
    </Box>
  );
}

export const TemplateFormsCard = () => {
  return (
    <MainPaper elevation={0} sx={{ p: "1ch" }}>
      <MainTypography variant="h5">Templates/Forms</MainTypography>
      <br />
      <MenuTree />
    </MainPaper>
  );
};
