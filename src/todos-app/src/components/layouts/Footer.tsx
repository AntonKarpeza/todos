import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => (
  <Box component="footer" sx={{ py: 2, textAlign: "center" }}>
    <Typography variant="body2" color="textSecondary">
      &copy; {new Date().getFullYear()} Todos App
    </Typography>
  </Box>
);

export default Footer;
