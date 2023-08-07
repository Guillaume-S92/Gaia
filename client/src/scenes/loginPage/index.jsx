import { Box, Typography, useMediaQuery } from "@mui/material";
import Form from "./Form";
import GrassIcon from "@mui/icons-material/Grass";

const LoginPage = () => {
const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
return (
<Box >
<Box
     width="100%"
     p="1rem 6%"
     textAlign="center"
   >
<Typography fontWeight="bold" fontSize="32px" color="#8F5C2C">
<GrassIcon /> Gaia
</Typography>
</Box>

<Box
    width={isNonMobileScreens ? "50%" : "93%"}
    p="2rem"
    m="2rem auto"
    borderRadius="1.5rem"
    boxShadow="2px 2px 6px #8F5C2C"
  >
    <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
      Bienvenue sur les terres fertiles de Gaia!
    </Typography>
    <Form />
  </Box>
</Box>
);
};

export default LoginPage;