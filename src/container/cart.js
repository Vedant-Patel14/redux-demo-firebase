import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cartSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toggleWishlist } from "../redux/reducers/wishlistslice";
import "../style/card.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Helmet } from "react-helmet-async";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LazyLoadImage } from "react-lazy-load-image-component";


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
    maxHeight: "200px",
    marginTop: "10px",
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

  title: {
    fontWeight: "500",
  },
});

const Cart = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const { data: fetchData, loading, error } = useFetch("products");
  const productData = fetchData;
  console.log(productData, error);
  // const auth = getAuth(app)

  const auth = useSelector((state) => state.auth.isAuthenticated);
  console.log(auth);


  const handleAddToCart = (product) => {
    if (auth) {
      dispatch(addToCart(product));
    } else {
      navigate("/login");
    }
  };

  const handleAddToWishlist = (product) => {
    if (auth) {
      dispatch(toggleWishlist(product));
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <Helmet>
        <title>Home page</title>
      </Helmet>
      <div>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <div
            className="container"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <Grid container spacing={3}>
              {productData.map((product) => (
                <Grid key={product.id} item xs={12} sm={6} md={4} xxl={3}>
                  <Card className={classes.card}>
                    <div className={classes.cardContent} key={product.id}>
                      <Link
                        to={`/product/${product.id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <LazyLoadImage
                          src={product.image}
                          alt=""
                          className={classes.img}
                          effect="blur"
                          width="100%"
                          height="auto"
                        />
                        <CardContent>
                          <h3 className={classes.title}>
                            <b>Category:</b> {product.category}
                          </h3>
                          <p>
                            <b>Price:</b>
                            <span className="price">{product.price}</span>
                          </p>
                          <Typography noWrap className="description">
                            <b>Description:</b> {product.description}
                          </Typography>
                        </CardContent>
                      </Link>
                      <div className={classes.addToCart}>
                        <IconButton
                          aria-label="add to wishlist"
                          onClick={() => handleAddToWishlist (product)}
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
                          variant="contained"
                          onClick={() => handleAddToCart(product)}
                        >
                          ADD TO CART
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
