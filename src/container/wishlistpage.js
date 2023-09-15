import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Navbar from "../component/navbar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toggleWishlist } from "../redux/reducers/wishlistslice";

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  img: {
    width: "100%",
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

const WishlistPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  console.log(wishlist);
  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Grid container spacing={3}>
          <Typography
            variant="h6"
            align="center"
            style={{ width: "100%", color: "rgb(0 0 0 )" }}
          >
            <h3>Your Wishlist</h3>
          </Typography>
          {wishlist.length === 0 ? (
            <Typography
              variant="h6"
              align="center"
              style={{ width: "100%", color: "rgb(255 0 0 / 96%)" }}
            >
              Your Wishlist is Empty.
            </Typography>
          ) : (
            wishlist.map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={4} xxl={3}>
                <Card className={classes.card}>
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <IconButton
                      aria-label="add to wishlist"
                      onClick={() => {
                        dispatch(toggleWishlist(product));
                      }}
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
                  <div className={classes.cardContent} key={product.id}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img src={product.image} alt="" className={classes.img} />
                    </div>
                    <CardContent>
                      <h3 className={classes.title}>
                        <b>Category:</b> {product.category}
                      </h3>
                      <p>
                        <b>Price:</b> {product.price}
                      </p>
                      <Typography noWrap>
                        <b>Description:</b> {product.description}
                      </Typography>
                    </CardContent>
                  </div>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </>
  );
};

export default WishlistPage;
