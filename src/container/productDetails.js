import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Navbar from "../component/navbar";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              </CardContent>
            </div>
          </Card>
        </Grid>
      </Container>
    </>
  );
};

export default ProductDetails;
