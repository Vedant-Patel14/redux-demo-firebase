import React from "react";
import {
  Button,
  Card,
  CardContent,
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

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  cardContent: {
    flex: "1 0 auto",
  },
  img: {
    width: "100%",
    marginTop: "10px",
    maxHeight: "200px",
    objectFit: "contain",
  },
  addToCart: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5px",
    margin: "10px",
  },
  topIcons: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
  },
  iconSpacing: {
    marginLeft: "1rem",
  },
});

const CartPage = () => {
  const cart = useSelector((state) => state.cart.cart);
  const classes = useStyles();
  const dispatch = useDispatch();
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

  return (
    <>
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
            Your Cart is Empty.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {cart.map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={4} xxl={3}>
                <Card className={classes.card}>
                  <div className={classes.cardContent}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img className={classes.img} src={product.image} alt="" />
                    </div>
                    <CardContent>
                      <Typography variant="h6">
                        <b>Category:</b> {product.category}
                      </Typography>
                      <Typography>
                        <b>Price:</b> {product.price}
                      </Typography>
                      <Typography noWrap>
                        <b>Description:</b> {product.description}
                      </Typography>
                      <div className={classes.addToCart}>
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
                              Are you sure you want to delete this product from
                              your cart?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
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
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </>
  );
};

export default CartPage;
