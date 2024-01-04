import { TablePagination , tablePaginationClasses as classes } from "@mui/material";
import { styled } from "@mui/system";

const blue = {
  200: "#A5D8FF",
  400: "#3399FF",
};
const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};
export const Root = styled("div")(
  ({ theme }) => `
              table {
                font-family: 'Raleway', sans-serif;
                font-size: 0.875rem;
                border-collapse: collapse;
                width: auto;
                padding:0.5rem;
              }
              
              td,
              th {
                border: 1px solid ${
                  theme.palette.mode === "dark" ? grey[800] : grey[200]
                };
                text-align: left;
                padding: 12px;
              }
              
              th {
                background-color: ${
                  theme.palette.mode === "dark" ? grey[900] : grey[100]
                };
              }
              `
);
export const CustomTablePagination = styled(TablePagination)(
  ({ theme }) => `
                & .${classes.toolbar} {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  align-items: end;
                  justify-content:space-around;
                  gap: 10px;
                  margin: 5px;
                }
                
                /* Update the select label styles */
                & .${classes.displayedRows} {
                  margin: 0;
                }
                /* Update the select label styles */
                & .${classes.selectLabel} {
                  margin: 0;
                }
                
                /* Update the select styles */
                & .${classes.select} {
                  padding: 2px;
                  border: 1px solid ${
                    theme.palette.mode === "dark" ? grey[800] : grey[200]
                  };
                  border-radius: 50px;
                  background-color: transparent;
                  
                  &:hover {
                    background-color: ${
                      theme.palette.mode === "dark" ? grey[800] : grey[50]
                    };
                  }
                  
                  &:focus {
                    outline: 1px solid ${
                      theme.palette.mode === "dark" ? blue[400] : blue[200]
                    };
                  }
                }
                
                /* Update the displayed rows styles */
                & .${classes.displayedRows} {
                  margin-left: 2rem;
                }
                `
);
