import React, { useState } from "react";
import { CartDash } from "react-bootstrap-icons";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MoreIcon from "@mui/icons-material/MoreVert";
import { logout } from "../redux/reducers/authSlice";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const useStyles = makeStyles((theme) => ({
  topIcons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    height: "50px",
  },
  homeIcon: {
    marginLeft: "40px",
  },
  iconSpacing: {
    fontSize: "25px",
    marginLeft: "0px",
  },
  navbar: {
    backgroundColor: "#b88bf72f",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const total = cart.length;
  const auth = getAuth(app);
  console.log("auth", auth);
  const totalWishlistItems = wishlist.length;
  const [anchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logout());
  };

  const handlelogIn = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile")
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [displayTypography, setDisplayTypography] = useState(true);

  return (
    <>
      <div className={classes.navbar}>
        <div className={classes.topIcons}>
          <div className="tag1">
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
              className={classes.homeIcon}
            >
              <HomeIcon />
            </NavLink>
          </div>
          {isMobile ? null : (
            <div>
              {isAuthenticated && user && displayTypography && (
                <Typography variant="body1" color="inherit" padding={"13px"}>
                  <p>
                    <b>User: {auth.currentUser?.email}</b>
                  </p>
                </Typography>
              )}
            </div>
          )}
          <div
            className="tag2"
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "15px",
            }}
          >
            <IconButton
              size="50"
              edge="end"
              color="inherit"
              className={`${classes.iconSpacing} ${
                isMobileMenuOpen ? classes.mobileIcons : ""
              }`}
              component={NavLink}
              to="/wishlist"
            >
              <Badge color="error" badgeContent={totalWishlistItems}>
                <FavoriteBorderIcon size={24} />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              component={NavLink}
              to="/cartpage"
              className={`${classes.iconSpacing} ${
                isMobileMenuOpen ? classes.mobileIcons : ""
              }`}
            >
              <Badge
                color="error"
                badgeContent={total}
                className={classes.iconSpacing}
              >
                <CartDash size={23} />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              className={classes.mobileMenuIcon}
            >
              <div>
                <MoreIcon />
              </div>
            </IconButton>
          </div>
        </div>
      </div>

      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id="mobile-menu"
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMobileMenuOpen}
        onClose={handleMenuClose}
      >
        {isAuthenticated ? (
          <div>
            <MenuItem
              onClick={handleProfileClick}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <div>
                <IconButton color="inherit">
                  <AccountCircleIcon />
                </IconButton>
                Profile
              </div>
            </MenuItem>
            <MenuItem
              onClick={handleLogOut}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <div>
                <IconButton color="inherit">
                  <LogoutIcon />
                </IconButton>
                Logout
              </div>
            </MenuItem>
          </div>
        ) : (
          <MenuItem onClick={handlelogIn}>
            <IconButton color="inherit">
              <LoginIcon />
            </IconButton>
            Login
          </MenuItem>
        )}
        {isMobile && isAuthenticated && user && (
          <MenuItem>
            <p>User:{auth.currentUser.email}</p>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Navbar;
