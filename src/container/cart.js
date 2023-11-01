import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cartSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton, // Import Skeleton from MUI
  TextField,
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
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Dropdown from "react-dropdown";
import useDebounce from "../hooks/useDebounce";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

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
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "10px",
  },
  filterControl: {
    flex: "1",
    margin: "10px",
    maxWidth: "300px",
  },
  searchControl: {
    flex: "1",
    margin: "10px",
  },
});

const Cart = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const { data: fetchData, loading, error } = useFetch("products");
  const productData = fetchData;
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const [sortOrder, setSortOrder] = useState("");
  console.log(productData, error);
  console.log(auth);

  const debouncedSearch = useDebounce(search, 1000);
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

  const handleCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = productData.filter((product) => {
    return (
      (!category || product.category === category) &&
      (product.description
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
        product.price.toString().includes(debouncedSearch))
    );
  });

  const sortedProducts = filteredProducts.slice();

  if (sortOrder === "lowToHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Helmet>
        <title>Home page</title>
      </Helmet>
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <div className={classes.filterContainer} style={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl
            style={{ border: "2px solid black" , borderRadius: "7px"  }}
            variant="filled"
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Category</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              variant="filled"
              value={category}
              label="Category"
              onChange={handleCategory}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="men's clothing">Men's Clothing</MenuItem>
              <MenuItem value="women's clothing">Women's Clothing</MenuItem>
              <MenuItem value="jewelry">Jewelry</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
            </Select>
          </FormControl>

          <div style={{ display: "flex" }}>
            <TextField
              label="Search"
              className={classes.searchControl}
              variant="filled"
              size="small"
              value={search}
              onChange={handleSearchChange}
              style={{
                marginLeft: "10px",
                width: "80%",
                border: "2px solid black",       
                borderRadius: "7px",
              }}
            />
          </div>

          <FormControl
            variant="filled"
            style={{ border: "2px solid black" , borderRadius: "7px", }}
            className={classes.filterControl}
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
            <InputLabel id="demo-simple-select-filled-label">Price</InputLabel>
            <Select
              labelId="demo-select-sort-label"
              id="demo-select-sort"
              variant="filled"
              value={sortOrder}
              label="Sort by Price"
              onChange={handleSortChange}
            > 
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="lowToHigh">Low to High</MenuItem>
              <MenuItem value="highToLow">High to Low</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div>
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <Grid container spacing={3}>
            {loading ? (
              Array.from({ length: 12 }).map((item , index) => (
                <Grid key={index} item xs={12} sm={6} md={4} xxl={3}>
                  <Card className={classes.card}>
                    <Skeleton variant="rectangular" width={500} height={350} animation="wave" />
                    <CardContent>
                      <Skeleton variant="text" animation="wave" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              sortedProducts.map((product) => (
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
                            <span
                              className="price"
                              style={{ border: "2px solid cadetblue" , borderRadius:"3px"  }}
                            >
                              {product.price}
                            </span>
                          </p>
                          <Typography noWrap className="description">
                            <b>Description:</b> {product.description}
                          </Typography>
                        </CardContent>
                      </Link>
                      <div className={classes.addToCart}>
                        <IconButton
                          aria-label="add to wishlist"
                          onClick={() => handleAddToWishlist(product)}
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
              ))
            )}
          </Grid>
          <div style={{display:"flex" , justifyContent:"end" , cursor:"grab"}}   >
            <ArrowCircleUpIcon onClick={handleScrollToTop} sx={{ fontSize: "3rem" }}  />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
