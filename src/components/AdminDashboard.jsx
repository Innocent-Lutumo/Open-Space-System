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
  Button,
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
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Refresh as RefreshIcon,
  ExitToApp as ExitToAppIcon,
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
  Undo as UndoIcon,
} from "@mui/icons-material";
import NotificationComponent from "./Notification";
import { Link } from "react-router-dom";

// Theme configuration
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#90caf9" : "#1976d2" },
      secondary: { main: mode === "dark" ? "#f48fb1" : "#dc004e" },
    },
  });

// StatusChip component
const StatusChip = ({ status }) => (
  <Chip
    label={status === "resolved" ? "Resolved" : "Pending"}
    color={status === "resolved" ? "success" : "warning"}
    size="small"
  />
);

// StatCard component
const StatCard = ({ title, value, icon, color = "primary.main" }) => (
  <Card>
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

// ExpandedReportModal component
const ExpandedReportModal = ({ open, onClose, report }) => {
  if (!report) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: 600 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Report Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>
          <strong>Open Space:</strong> {report.open_space_name}
        </Typography>
        <Typography>
          <strong>Street:</strong> {report.street}
        </Typography>
        <Typography>
          <strong>Reporter:</strong> {report.reporter_name}
        </Typography>
        <Typography>
          <strong>Description:</strong> {report.description}
        </Typography>
        <Typography>
          <strong>Status:</strong>{" "}
          <StatusChip status={report.is_resolved ? "resolved" : "pending"} />
        </Typography>
        <Typography>
          <strong>Date:</strong>{" "}
          {new Date(report.date_reported).toLocaleDateString()}
        </Typography>
        {report.photos?.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6">Photos:</Typography>
            <Grid container spacing={1} mt={1}>
              {report.photos.map((photo, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <img
                    src={photo}
                    alt={`Report ${index + 1}`}
                    style={{ width: "100%", borderRadius: 4 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

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
          <strong>Location:</strong> {location.open_space_name}
        </Typography>
        <Typography>
          <strong>Address:</strong> {location.street}
        </Typography>
        <Typography>
          <strong>Coordinates:</strong> {location.latitude},{" "}
          {location.longitude}
        </Typography>
      </Box>
    </Modal>
  );
};

// Hardcoded data
const hardcodedReports = [
  {
    id: 1,
    open_space_name: "City Park",
    street: "Park Avenue",
    reporter_name: "John Doe",
    latitude: 34.0522,
    longitude: -118.2437,
    description:
      "Illegal dumping of construction waste near the main entrance.",
    is_resolved: false,
    photos: [
      "https://picsum.photos/400?random=1",
      "https://picsum.photos/400?random=2",
    ],
    date_reported: "2024-07-25T10:00:00Z",
  },
  {
    id: 2,
    open_space_name: "Community Garden",
    street: "Garden Street",
    reporter_name: "Jane Smith",
    latitude: 34.0522,
    longitude: -118.2437,
    description:
      "Someone is building an unauthorized shed in the middle of the garden.",
    is_resolved: true,
    photos: ["https://picsum.photos/400?random=3"],
    date_reported: "2024-07-20T14:30:00Z",
  },
  {
    id: 3,
    open_space_name: "Riverfront Promenade",
    street: "Riverside Drive",
    reporter_name: "Peter Jones",
    latitude: 34.0522,
    longitude: -118.2437,
    description: "Vandalism and graffiti on the benches and walkway.",
    is_resolved: false,
    photos: [
      "https://picsum.photos/400?random=4",
      "https://picsum.photos/400?random=5",
    ],
    date_reported: "2024-07-22T08:15:00Z",
  },
];

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const theme = useMemo(
    () => getTheme(darkMode ? "dark" : "light"),
    [darkMode]
  );
  const drawerWidth = 240;

  const stats = useMemo(
    () => ({
      resolved: reports.filter((report) => report.is_resolved).length,
      pending: reports.filter((report) => !report.is_resolved).length,
      total: reports.length,
    }),
    [reports]
  );

  const fetchReports = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setReports(hardcodedReports);
      setLoading(false);
    }, 1000);
  }, []);

  const handleResolveReport = useCallback((reportId) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, is_resolved: true } : report
      )
    );
  }, []);

  const handleUnresolveReport = useCallback((reportId) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, is_resolved: false } : report
      )
    );
  }, []);

  const filterReports = useCallback(() => {
    if (!reports.length) {
      setFilteredReports([]);
      return;
    }

    const filtered = reports.filter((report) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "resolved" && report.is_resolved) ||
        (filter === "pending" && !report.is_resolved);

      const searchFields = [
        report.open_space_name,
        report.street,
        report.description,
        report.reporter_name,
      ].filter(Boolean);

      const matchesSearch =
        searchQuery === "" ||
        searchFields.some((field) =>
          String(field).toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesFilter && matchesSearch;
    });

    setFilteredReports(filtered);
  }, [reports, filter, searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    filterReports();
  }, [filterReports]);

  const displayedReports = useMemo(
    () =>
      filteredReports.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredReports, page, rowsPerPage]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
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
                placeholder="Search reports..."
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
              onClick={fetchReports}
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
            "& .MuiDrawer-paper": {
              width: drawerOpen ? drawerWidth : 56,
              overflowX: "hidden",
              transition: theme.transitions.create("width"),
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
              <ListItem button component={Link} to="/Openspace">
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

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Open Space Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Review and manage reports of illegal use of open spaces.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Modify the Grid items below */}
            <Grid item xs={12} width={"30%"}>
              <StatCard
                title="Total Reports"
                value={stats.total}
                icon={<OpenSpaceIcon color="primary" />}
              />
            </Grid>
            <Grid item xs={12} width={"30%"}>
              <StatCard
                title="Pending"
                value={stats.pending}
                color="warning.main"
                icon={<HourglassEmptyIcon color="warning" />}
              />
            </Grid>
            <Grid item xs={12} width={"30%"}>
              <StatCard
                title="Resolved"
                value={stats.resolved}
                color="success.main"
                icon={<CheckCircleIcon color="success" />}
              />
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h6">Reports</Typography>
              {["all", "resolved", "pending"].map((filterOption) => (
                <Chip
                  key={filterOption}
                  label={
                    filterOption.charAt(0).toUpperCase() + filterOption.slice(1)
                  }
                  onClick={() => setFilter(filterOption)}
                  variant={filter === filterOption ? "filled" : "outlined"}
                  color={
                    filterOption === "resolved"
                      ? "success"
                      : filterOption === "pending"
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
            <Paper sx={{ bgcolor: "background.paper" }}>
              <TableContainer sx={{ bgcolor: "background.paper" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Open Space</TableCell>
                      <TableCell>Street</TableCell>
                      <TableCell>Reporter</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedReports.map((report) => (
                      <TableRow
                        key={report.id}
                        hover
                        onClick={() => setExpandedReport(report)}
                        sx={{ cursor: "pointer", bgcolor: "background.paper" }}
                      >
                        <TableCell>{report.open_space_name}</TableCell>
                        <TableCell>{report.street}</TableCell>
                        <TableCell>{report.reporter_name}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Tooltip title="View Location Details">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLocation(report);
                                  setShowMap(true);
                                }}
                              >
                                <LocationOnIcon
                                  fontSize="small"
                                  color="success"
                                />
                              </IconButton>
                            </Tooltip>
                            {report.latitude}, {report.longitude}
                          </Box>
                        </TableCell>
                        <TableCell>{report.description}</TableCell>
                        <TableCell>
                          <StatusChip
                            status={report.is_resolved ? "resolved" : "pending"}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {!report.is_resolved ? (
                            <Tooltip title="Mark as Resolved">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResolveReport(report.id);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Mark as Pending">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnresolveReport(report.id);
                                }}
                              >
                                <UndoIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredReports.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{ bgcolor: "background.paper" }}
              />
            </Paper>
          )}
        </Box>

        <ExpandedReportModal
          open={!!expandedReport}
          onClose={() => setExpandedReport(null)}
          report={expandedReport}
        />
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

export default AdminDashboard;
