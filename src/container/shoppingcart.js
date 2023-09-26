import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../component/navbar";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  decrementQuantity,
  removeItem,
  incrementQuantity,
} from "../redux/reducers/cartSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toggleWishlist } from "../redux/reducers/wishlistslice";
import { Helmet } from "react-helmet";
import { Store } from "../redux/store";
import { Navigate, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: "550px",
    border: "2px solid black",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
  },
  "@media (max-width: 654px)": {
    cardContent: {
      flexDirection: "column",
    },
  },
  img: {
    objectFit: "contain",
  },
  addToCart: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5px",
  },
  topIcons: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
  },
  billbook: {
    position: "sticky",
    top: "20px",
    background: "#777777",
    height: "175px",
  },
});

const CartPage = () => {
  const cart = useSelector((state) => state?.cart?.cart);
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [openProductId, setOpenProductId] = React.useState(null);

  const handleOpenDialog = (productId) => {
    setOpenProductId(productId);
  };

  const handleClose = () => {
    setOpenProductId(null);
  };

  const handleDeleteProduct = (productId) => {
    dispatch(removeItem(productId));
    handleClose();
  };

  const handleCheckOut = () => {
    navigate("/Checkout");
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, product) => {
      const productPrice = parseFloat(product.price);
      const productQuantity = product.quantity;
      return total + productPrice * productQuantity;
    }, 0);
  };

  const tax = () => {
    const subtotal = calculateSubtotal();
    const taxtotal = subtotal * 0.18;
    return taxtotal.toFixed(2);
  };

  const totalAmount = () => {
    const subtotal = calculateSubtotal();
    const taxtotal = tax();
    const total = subtotal + parseFloat(taxtotal);
    return total.toFixed(2);
  };

  return (
    <>
      <Helmet>
        <title>Cart page</title>
      </Helmet>
      <Navbar />
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Typography
          variant="h6"
          align="center"
          style={{ width: "100%", color: "rgb(0 0 0 / 96%)" }}
        >
          <h3>Your Cart</h3>
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12} md={6}>
            {cart.length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                style={{
                  width: "100%",
                  color: "rgb(255 13 13)",
                  fontWeight: "1.25rem",
                }}
              >
                <p>Your Cart is Empty.</p>
              </Typography>
            ) : (
              cart.map((product) => (
                <Container maxWidth="md" key={product.id}>
                  <Card
                    className={classes.card}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ marginLeft: "auto", height: "32px" }}>
                      <IconButton
                        aria-label="add to wishlist"
                        onClick={() => dispatch(toggleWishlist(product))}
                        className={classes.wishlist}
                      >
                        {wishlist.some((item) => item.id === product.id) ? (
                          <FavoriteIcon
                            style={{ fontSize: "30px", color: "red" }}
                          />
                        ) : (
                          <FavoriteBorderIcon style={{ fontSize: "30px" }} />
                        )}
                      </IconButton>
                    </div>
                    <Box className={classes.cardContent}>
                      <div
                        style={{
                          padding: "8px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          className={classes.img}
                          src={product.image}
                          alt=""
                          width={200}
                          height={200}
                        />
                      </div>
                      <div style={{ maxWidth: "278px" }}>
                        <CardContent>
                          <Typography variant="h6">
                            <b>Title:</b> {product.title}
                          </Typography>
                          <Typography variant="h6">
                            <b>Price:</b> {product.price}
                          </Typography>
                          <Typography variant="h6">
                            <b>Category:</b> {product.category}
                          </Typography>
                          <Typography noWrap variant="h6">
                            <b>Description:</b> {product.description}
                          </Typography>
                          <div className={classes.addToCart}>
                            <Button
                              variant="outlined"
                              onClick={() => handleOpenDialog(product.id)}
                            >
                              Remove
                            </Button>
                            <Dialog
                              open={openProductId === product.id}
                              onClose={handleClose}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <DialogTitle id="alert-dialog-title">
                                Confirm Product Removal
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  Are you sure you want to delete this product
                                  from your cart?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  Delete
                                </Button>
                                <Button onClick={handleClose} autoFocus>
                                  Cancel
                                </Button>
                              </DialogActions>
                            </Dialog>

                            <div>
                              <Button
                                variant="contained"
                                size="small"
                                style={{ margin: "3px", height: "24px" }}
                                onClick={() =>
                                  dispatch(decrementQuantity(product.id))
                                }
                              >
                                -
                              </Button>
                              <span>{product.quantity}</span>
                              <Button
                                variant="contained"
                                size="small"
                                style={{ margin: "3px", height: "24px" }}
                                onClick={() =>
                                  dispatch(incrementQuantity(product.id))
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Box>
                  </Card>
                </Container>
              ))
            )}

            {cart.length > 0 && (
              <Grid item xs={12}>
                <div className={classes.billbook}>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <h2 style={{ margin: "0" }}>SubTotal:</h2>
                    <h2 style={{ color: "aliceblue", margin: "0" }}>
                      {calculateSubtotal().toFixed(2)}
                    </h2>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: "5px",
                    }}
                  >
                    <h2 style={{ margin: "0" }}>GST-Tax:</h2>
                    <h2 style={{ color: "aliceblue", margin: "0" }}>{tax()}</h2>
                  </div>
                  <hr />
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <h1 style={{ margin: "0" }}>Total:</h1>
                    <h1 style={{ color: "aliceblue", margin: "0" }}>
                      {totalAmount()}
                    </h1>
                  </div>
                  <hr />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleCheckOut}
                    >
                      CheckOut
                    </Button>
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default CartPage;
