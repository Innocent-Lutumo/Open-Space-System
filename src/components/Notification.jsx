import React, { useState, useCallback } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Notification data
const notificationData = [
  {
    id: 1,
    title: "New Report Submitted",
    message: "Illegal dumping reported at City Park",
    type: "warning",
    timestamp: "2 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    title: "Report Resolved",
    message: "Community Garden shed issue has been resolved",
    type: "success",
    timestamp: "1 hour ago",
    isRead: false,
  },
  {
    id: 3,
    title: "System Update",
    message: "Dashboard maintenance scheduled for tonight",
    type: "info",
    timestamp: "3 hours ago",
    isRead: true,
  },
  {
    id: 4,
    title: "New User Registration",
    message: "5 new users registered today",
    type: "info",
    timestamp: "5 hours ago",
    isRead: true,
  },
  {
    id: 5,
    title: "High Priority Report",
    message: "Vandalism at Riverfront Promenade needs attention",
    type: "warning",
    timestamp: "1 day ago",
    isRead: false,
  },
];

const NotificationComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(notificationData);
  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  }, []);

  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: "small" };
    switch (type) {
      case "success":
        return <CheckCircleIcon {...iconProps} sx={{ color: "#2e7d32" }} />;
      case "warning":
        return <WarningIcon {...iconProps} sx={{ color: "#8b4513" }} />;
      case "info":
      default:
        return <InfoIcon {...iconProps} sx={{ color: "#6d4c41" }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "#2e7d32";
      case "warning":
        return "#8b4513";
      case "info":
      default:
        return "#6d4c41";
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          mr: 1,
          "&:hover": {
            backgroundColor: "rgba(139, 69, 19, 0.1)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#8b4513",
              color: "white",
              fontWeight: "bold",
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            backgroundColor: "#fafafa",
            border: "1px solid #d7ccc8",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, backgroundColor: "#8b4513", color: "white" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Notifications
            </Typography>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: "white" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {unreadCount > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={1}
            >
              <Chip
                label={`${unreadCount} unread`}
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
              <Button
                size="small"
                onClick={markAllAsRead}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontSize: "0.75rem",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Mark all as read
              </Button>
            </Box>
          )}
        </Box>

        <List sx={{ p: 0, maxHeight: 350, overflow: "auto" }}>
          {notifications.length === 0 ? (
            <ListItem>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                py={3}
              >
                <NotificationsIcon
                  sx={{ fontSize: 48, color: "#bcaaa4", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => markAsRead(notification.id)}
                  sx={{
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : "#f3e5ab",
                    "&:hover": {
                      backgroundColor: notification.isRead
                        ? "rgba(139, 69, 19, 0.05)"
                        : "#ede7c4",
                    },
                    borderLeft: notification.isRead
                      ? "none"
                      : `4px solid ${getNotificationColor(notification.type)}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box position="relative">
                      {getNotificationIcon(notification.type)}
                      {!notification.isRead && (
                        <CircleIcon
                          sx={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            fontSize: 8,
                            color: "#2e7d32",
                          }}
                        />
                      )}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notification.isRead ? "normal" : "bold",
                          color: "#3e2723",
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#5d4037",
                            mb: 0.5,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#8d6e63",
                            fontStyle: "italic",
                          }}
                        >
                          {notification.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && (
                  <Divider sx={{ backgroundColor: "#d7ccc8" }} />
                )}
              </React.Fragment>
            ))
          )}
        </List>

        {notifications.length > 0 && (
          <>
            <Divider sx={{ backgroundColor: "#d7ccc8" }} />
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Button
                variant="text"
                sx={{
                  color: "#8b4513",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(139, 69, 19, 0.05)",
                  },
                }}
              >
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationComponent;
