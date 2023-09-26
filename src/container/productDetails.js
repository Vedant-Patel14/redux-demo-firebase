import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Navbar from "../component/navbar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cartSlice";
import { toggleWishlist } from "../redux/reducers/wishlistslice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);
  const theme = useTheme();
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    setTimeout(() => {
      setFetchedData([]);
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/${productId}`
      );
      const productData = await response.json();
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
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
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div>
        {fetchedData ? (
          <div>
            <p>{fetchedData}</p>
          </div>
        ) : (
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
        )}
      </div>
      <Container maxWidth="md">
        <Grid item xs={12} sm={6} md={4} xxl={3}>
          <Card style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <img
                src={product.image}
                alt=""
                style={{
                  width: isMobile ? "" : "20%",
                  padding: "16px",
                }}
              />
              <CardContent>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    aria-label="add to wishlist"
                    onClick={() => dispatch(toggleWishlist(product))}
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
                <Typography variant="h5" gutterBottom>
                  {product.title}
                </Typography>
                <Typography>
                  <b>Category:</b> {product.category}
                </Typography>
                <Typography>
                  <b>Price:</b> {product.price}
                </Typography>
                <Typography>
                  <b>Description:</b> {product.description}
                </Typography>
                <br></br>
                <div style={{display:"flex" , gap:"10px"}}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAddToCart(product)}
                  >
                    ADD TO CART
                  </Button>
                  <Button
                    variant="contained"
                  >
                    BUY NOW
                  </Button>
                
                </div>
              </CardContent>
            </div>
          </Card>
        </Grid>
      </Container>
    </>
  );
};

export default ProductDetails;
