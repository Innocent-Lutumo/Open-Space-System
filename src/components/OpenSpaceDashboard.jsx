import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  TextField,
  Grid,
  Box,
  Chip,
  Avatar,
  ThemeProvider,
  CssBaseline,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Paper,
  Modal,
  createTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Public as OpenSpaceIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Refresh as RefreshIcon,
  ExitToApp as ExitToAppIcon,
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import NotificationComponent from "./Notification";

// Theme configuration with layout fixes
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#90caf9" : "#1976d2" },
      secondary: { main: mode === "dark" ? "#f48fb1" : "#dc004e" },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            // Ensure AppBar doesn't have extra padding
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            paddingLeft: 24, // Consistent left padding
            paddingRight: 24, // Consistent right padding
            "@media (min-width: 600px)": {
              paddingLeft: 24,
              paddingRight: 24,
            },
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: "0!important",
            paddingRight: "0!important",
            marginLeft: "0!important",
            marginRight: "0!important",
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          root: {
            margin: "0!important", // Remove default margin
            width: "100%", // Ensure it takes full width
          },
          item: {
            paddingLeft: "24px!important", // Add back spacing between grid items
            paddingTop: "24px!important", // Add back spacing
            "&:not(:first-of-type)": {
              paddingLeft: "24px!important",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            width: "100%",
            boxSizing: "border-box", // Include padding and border in the element's total width and height
          },
        },
      },
    },
  });

// StatusChip component
const StatusChip = ({ status }) => (
  <Chip
    label={status === "Active" ? "Active" : status}
    color={
      status === "Active"
        ? "success"
        : status === "Under Maintenance"
        ? "warning"
        : "error"
    }
    size="small"
  />
);

// StatCard component
const StatCard = ({ title, value, icon, color = "primary.main" }) => (
  <Card
    sx={{
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      "& .MuiCardContent-root": {
        width: "100%",
      },
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color }}>
            {value}
          </Typography>
        </Box>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

// OpenSpaceMapModal component
const OpenSpaceMapModal = ({ open, onClose, location }) => {
  if (!location) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: 500 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Location Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>
          <strong>Open Space:</strong> {location.name}
        </Typography>
        <Typography>
          <strong>Address:</strong> {location.address}
        </Typography>
        <Typography>
          <strong>Status:</strong> <StatusChip status={location.status} />
        </Typography>
        <Typography>
          <strong>Coordinates:</strong> {location.lat}, {location.lng}
        </Typography>
      </Box>
    </Modal>
  );
};

const hardcodedOpenSpaces = [
  {
    id: 1,
    name: "City Park",
    address: "123 Park Ave",
    lat: 34.0522,
    lng: -118.2437,
    status: "Active",
  },
  {
    id: 2,
    name: "Community Garden",
    address: "456 Garden St",
    lat: 34.0535,
    lng: -118.245,
    status: "Active",
  },
  {
    id: 3,
    name: "Riverfront Promenade",
    address: "789 Riverside Dr",
    lat: 34.054,
    lng: -118.2465,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Westside Fields",
    address: "101 Field Ln",
    lat: 34.051,
    lng: -118.242,
    status: "Active",
  },
  {
    id: 5,
    name: "Central Plaza",
    address: "202 Plaza Blvd",
    lat: 34.0555,
    lng: -118.2475,
    status: "Under Maintenance",
  },
];

function OpenSpaceList() {
  const [openSpaces, setOpenSpaces] = useState([]);
  const [filteredOpenSpaces, setFilteredOpenSpaces] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const theme = useMemo(
    () => getTheme(darkMode ? "dark" : "light"),
    [darkMode]
  );
  const drawerWidth = 240;

  const stats = useMemo(
    () => ({
      total: openSpaces.length,
      active: openSpaces.filter((space) => space.status === "Active").length,
      inactive: openSpaces.filter((space) => space.status !== "Active").length,
    }),
    [openSpaces]
  );

  const fetchOpenSpaces = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setOpenSpaces(hardcodedOpenSpaces);
      setLoading(false);
    }, 1000);
  }, []);

  const filterOpenSpaces = useCallback(() => {
    if (!openSpaces.length) {
      setFilteredOpenSpaces([]);
      return;
    }

    const filtered = openSpaces.filter((space) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && space.status === "Active") ||
        (filter === "inactive" && space.status !== "Active");

      const searchFields = [space.name, space.address, space.status].filter(
        Boolean
      );

      const matchesSearch =
        searchQuery === "" ||
        searchFields.some((field) =>
          String(field).toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesFilter && matchesSearch;
    });

    setFilteredOpenSpaces(filtered);
  }, [openSpaces, filter, searchQuery]);

  useEffect(() => {
    fetchOpenSpaces();
  }, [fetchOpenSpaces]);

  useEffect(() => {
    filterOpenSpaces();
  }, [filterOpenSpaces]);

  const displayedOpenSpaces = useMemo(
    () =>
      filteredOpenSpaces.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredOpenSpaces, page, rowsPerPage]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          overflowX: "hidden",
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            // Calculate width based on drawer state
            width: "100%",
            // Move AppBar to the right of the drawer
            ml: drawerOpen ? drawerWidth : 56,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(!drawerOpen)}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Open Space Management
            </Typography>
            <Box
              sx={{ display: { xs: "none", md: "flex" }, width: 300, mr: 2 }}
            >
              <TextField
                placeholder="Search open spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="standard"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& input": { color: "white" } }}
              />
            </Box>
            <NotificationComponent />
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton
              color="inherit"
              onClick={fetchOpenSpaces}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, ml: 1 }}>A</Avatar>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : 56,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerOpen ? drawerWidth : 56,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          <Toolbar />
          <Box sx={{ mt: 2 }}>
            {drawerOpen && (
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 1 }}>
                  A
                </Avatar>
                <Typography variant="subtitle1">Admin User</Typography>
                <Typography variant="body2" color="text.secondary">
                  admin@example.com
                </Typography>
              </Box>
            )}
            <List>
              <ListItem button component={Link} to="/">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                {drawerOpen && <ListItemText primary="Report Dashboard" />}
              </ListItem>
              <ListItem button component={Link} to="/Openspace" selected>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                {drawerOpen && <ListItemText primary="Open Spaces List" />}
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemIcon sx={{ color: "red" }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText primary="Logout" sx={{ color: "red" }} />
                )}
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            // Calculate width based on drawer state
            width: `calc(100% - ${drawerOpen ? drawerWidth : 56}px)`,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              "& > *": {
                width: "100%",
              },
            }}
          >
            <Typography variant="h4" gutterBottom>
              Open Spaces
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Review and manage all open spaces.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Modify the Grid items below */}
              <Grid item xs={12} width={"30%"}>
                <StatCard
                  title="Total Spaces"
                  value={stats.total}
                  icon={<OpenSpaceIcon color="primary" />}
                />
              </Grid>
              <Grid item xs={12} width={"30%"}>
                <StatCard
                  title="Active"
                  value={stats.active}
                  color="success.main"
                  icon={<CheckCircleIcon color="success" />}
                />
              </Grid>
              <Grid item xs={12} width={"30%"}>
                <StatCard
                  title="Inactive"
                  value={stats.inactive}
                  color="warning.main"
                  icon={<HourglassEmptyIcon color="warning" />}
                />
              </Grid>
            </Grid>

            <Paper
              sx={{
                p: 2,
                mb: 3,
                width: "100%",
                boxSizing: "border-box",
                mt: 3, // Add top margin to separate from stat cards
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6">Open Spaces</Typography>
                {["all", "active", "inactive"].map((filterOption) => (
                  <Chip
                    key={filterOption}
                    label={
                      filterOption.charAt(0).toUpperCase() +
                      filterOption.slice(1)
                    }
                    onClick={() => setFilter(filterOption)}
                    variant={filter === filterOption ? "filled" : "outlined"}
                    color={
                      filterOption === "active"
                        ? "success"
                        : filterOption === "inactive"
                        ? "warning"
                        : "primary"
                    }
                  />
                ))}
              </Box>
            </Paper>

            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <Paper
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  boxSizing: "border-box",
                }}
              >
                <TableContainer sx={{ width: "100%" }}>
                  <Table sx={{ minWidth: "100%" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Open Space</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedOpenSpaces.map((space) => (
                        <TableRow
                          key={space.id}
                          hover
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{space.name}</TableCell>
                          <TableCell>{space.address}</TableCell>
                          <TableCell>
                            <StatusChip status={space.status} />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Tooltip title="View Location Details">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLocation(space);
                                    setShowMap(true);
                                  }}
                                >
                                  <LocationOnIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                </IconButton>
                              </Tooltip>
                              {space.lat}, {space.lng}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredOpenSpaces.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  sx={{ width: "100%" }}
                />
              </Paper>
            )}
          </Box>
        </Box>

        <OpenSpaceMapModal
          open={showMap}
          onClose={() => {
            setShowMap(false);
            setSelectedLocation(null);
          }}
          location={selectedLocation}
        />
      </Box>
    </ThemeProvider>
  );
}

export default OpenSpaceList;
