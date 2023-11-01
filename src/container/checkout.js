import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Grid,
  Modal,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import gpay from "../assests/gpay.svg";
import paytm from "../assests/paytm.svg";
import phonepay from "../assests/phonepe.svg";
import SuccessImage from "../assests/Success image.png";
import SendIcon from "@mui/icons-material/Send";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";



const Checkout = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectpayment, setSelectPayment] = useState("");
  const [open, setOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const checkout = useSelector((state) => state.cart.cart);
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [Order, setOrder] = useState("");
  const [isPurchaseDisabled, setIsPurchaseDisabled] = useState(true);
  const [saveCardForFuture, setSaveCardForFuture] = useState(false);

  const handleOpen = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to make a purchase.");
    return;
  }

  if (!selectedValue) {
    alert("Please select a payment method.");
    return;
  }

  if (selectedValue === "creditCard") {
    if (!cardNumber || !cardHolderName || !cvv) {
      alert("Please fill in all credit card details.");
      return;
    }
  }

  setLoading(true);

  try {
    if (!user || !user.uid) {
      throw new Error("User not authenticated or UID missing.");
    }

    const orderData = {
      uid: user.uid,
      paymentMethod: selectedValue,
      cardNumber: saveCardForFuture ? cardNumber : "",
      cardHolderName: saveCardForFuture ? cardHolderName : "",
      cvv: saveCardForFuture ? cvv : "",
      items: checkout,
      subtotal: calculateSubtotal().toFixed(2),
      tax: tax(),
      total: totalAmount(),
    };

    const userOrdersCollectionRef = collection(db, "orders", "userOrders", user.uid);
    const userOrderDocRef = doc(userOrdersCollectionRef);

    await setDoc(userOrderDocRef, orderData);

    setLoading(false);
    setOpen(true);
  } catch (error) {
    console.error("Error creating order: ", error);
    setLoading(false);
    alert("An error occurred while processing your order.");
  }
};

  

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getSavedCardData(user.uid)
        .then((savedCardData) => {
          if (savedCardData) {
            setCardNumber(savedCardData.cardNumber);
            setCardHolderName(savedCardData.cardHolderName);
            setCvv(savedCardData.cvv);
          }
        })
        .catch((error) => {
          console.error("Error fetching saved card data: ", error);
        });
    }
  }, []);


const getSavedCardData = async (uid) => {
  try {
    const userOrdersCollectionRef = collection(db, "orders", "userOrders", uid);
    const userOrderDocRef = doc(userOrdersCollectionRef);
    const docSnapshot = await getDoc(userOrderDocRef);

    if (docSnapshot.exists()) {
      const orderData = docSnapshot.data();

      if (orderData.paymentMethod === "creditCard" && orderData.cardNumber) {
        return {
          cardNumber: orderData.cardNumber,
          cardHolderName: orderData.cardHolderName,
          cvv: orderData.cvv,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching saved card data: ", error);
    throw error;
  }
};

  useEffect(() => {
    const hasErrors =
      selectedValue === "creditCard" &&
      (!cardNumber || !cardHolderName || !cvv);

    setIsPurchaseDisabled(!selectedValue || hasErrors);
  }, [selectedValue, cardNumber, cvv, cardHolderName]);

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handlePaymentChange = (value) => {
    setSelectedValue(value);
  };

  const handleSelectpayment = (value) => {
    setSelectPayment(value);
  };

  const handleCardNumberChange = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    setCardNumber(inputValue);
  };

  const calculateSubtotal = () => {
    return checkout.reduce((total, product) => {
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

  const handleBack = () => {
    navigate("/CartPage");
  };

  const handleCvvChange = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/[^0-9]/g, "");
    const limitedInput = numericInput.slice(0, 3);
    setCvv(limitedInput);
  };

  const CardHolderNameTextField = () => {
    const inputValue = event.target.value;
    const sanitizedInput = inputValue.replace(/[^a-zA-Z\s]/g, "");
    setCardHolderName(sanitizedInput);
  };

  return (
    <>
      <Helmet>
        <title>Check Out</title>
      </Helmet>
      <Container maxWidth="md">
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ height: "100vh", flex: "70%" }}>
            <Box>
              <h1 style={{ margin: "12px", color: "cornflowerblue" }}>
                Payment
              </h1>
            </Box>

            <h2 style={{ display: "flex", margin: "12px" }}>Card Type</h2>
            <Box
              style={{
                gap: "10px",
                marginRight: "12px",
                marginLeft: "12px",
              }}
            >
              <Box>
                <h3 style={{ border: "1px solid" }}>
                  <Radio
                    checked={selectedValue === "creditCard"}
                    onChange={() => handlePaymentChange("creditCard")}
                    value="creditCard"
                    name="paymentMethod"
                    color="success"
                  />
                  Credit Card
                </h3>
              </Box>

              <Box>
                <h3 style={{ border: "1px solid" }}>
                  <Radio
                    checked={selectedValue === "paypal"}
                    onChange={() => handlePaymentChange("paypal")}
                    value="paypal"
                    name="paymentMethod"
                    color="success"
                  />
                  Paypal
                </h3>
              </Box>

              {selectedValue === "paypal" && (
                <>
                  <Box
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <Box style={{ display: "flex" }}>
                      <Radio
                        style={{ padding: "0px" }}
                        checked={selectpayment === "paytm"}
                        onChange={() => handleSelectpayment("paytm")}
                        value="paytm"
                        name="paymentMethod"
                        color="success"
                      />
                      <img src={paytm} alt="Paytm" width={50} height={50} />
                    </Box>

                    <Box style={{ display: "flex" }}>
                      <Radio
                        checked={selectpayment === "googlePay"}
                        onChange={() => handleSelectpayment("googlePay")}
                        value="googlePay"
                        name="paymentMethod"
                        color="success"
                      />
                      <img src={gpay} alt="Google Pay" width={50} height={50} />
                    </Box>

                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <Radio
                        checked={selectpayment === "phonePe"}
                        onChange={() => handleSelectpayment("phonePe")}
                        value="phonePe"
                        name="paymentMethod"
                        color="success"
                      />
                      <img
                        src={phonepay}
                        alt="PhonePe"
                        width={30}
                        height={30}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {selectedValue === "creditCard" && (
              <>
                <Box style={{ padding: "12px" }}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    onChange={handleCardNumberChange}
                    value={cardNumber}
                  />
                </Box>

                <Box style={{ padding: "12px" }}>
                  <TextField
                    fullWidth
                    label="Card Holder Name"
                    value={cardHolderName}
                    onChange={CardHolderNameTextField}
                  />
                </Box>

                <Box
                  style={{
                    display: "flex",
                    padding: "12px",
                    gap: "10px",
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  <Box style={{ flex: "45%" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker label="Basic date picker" />
                    </LocalizationProvider>
                  </Box>

                  <Box style={{ flex: "45%" }}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="CVV Code"
                      variant="outlined"
                      value={cvv}
                      onChange={handleCvvChange}
                    />
                  </Box>
                </Box>
              </>
            )}

            {/* <Box style={{padding:"12px"}}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Your Address"
                variant="outlined"
                // value={address}
              >
                Address
              </TextField>
            </Box> */}

            <Box>
              <Checkbox
                color="success"
                checked={saveCardForFuture}
                onChange={(e) => setSaveCardForFuture(e.target.checked)}
              />
              <span>Save my card for the future</span>
            </Box>

            <Box style={{ display: "flex" }}>
              <Box
                onClick={handleBack}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  gap: "10px",
                  flex: "45%",
                }}
              >
                <Box>
                  <KeyboardBackspaceIcon />
                </Box>
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <span>Back</span>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ height: "100%", flex: "40%" }}>
            <Box>
              <h1 style={{ color: "red" }}>Order</h1>
              <hr />
            </Box>

            {checkout.map((item) => (
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <img src={item.image} alt="" width={100} height={100} />
                </Box>

                <Box style={{ marginLeft: "10px", display: "flex" }}>
                  <Typography variant="h6">
                    <p style={{ fontSize: "16px" }}>{item.title}</p>
                  </Typography>

                  <Box>
                    <Box>
                      <Typography variant="h6">
                        <p
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {item.quantity}
                        </p>
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="h6">
                        <p> {item.price}</p>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
            <hr />
            <Grid item xs={12}>
              <Box>
                <Box style={{ display: "flex", justifyContent: "center" }}>
                  <h3
                    style={{
                      borderBottom: "1px solid black",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "red")}
                    onMouseOut={(e) => (e.target.style.color = "black")}
                  >
                    Have a discount code?
                  </h3>
                </Box>

                <Box
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <h2 style={{ margin: "0" }}>SubTotal:</h2>
                  <h2 style={{ color: "#275d8d", margin: "0" }}>
                    {calculateSubtotal().toFixed(2)}
                  </h2>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "5px",
                  }}
                >
                  <h2 style={{ margin: "0" }}>GST-Tax:</h2>
                  <h2 style={{ color: "#275d8d", margin: "0" }}>{tax()}</h2>
                </Box>
                <hr />
                <Box
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <h1 style={{ margin: "0" }}>Total:</h1>
                  <h1 style={{ color: "#275d8d", margin: "0" }}>
                    {totalAmount()}
                  </h1>
                </Box>
                <hr />
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "10px",
                  }}
                ></Box>
                <Box
                  style={{
                    padding: "12px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleOpen}
                    disabled={isPurchaseDisabled}
                  >
                    {loading ? <CircularProgress size={24} /> : "Purchase"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Container>

      {/* Model */}
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "90%",
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {/* Text in a Modal */}
            <h2 id="parent-modal-title">Order Successful</h2>

            {/* Success Image */}
            <img
              style={{ maxWidth: "100%", height: "auto" }}
              src={SuccessImage}
              alt="Success"
            />

            {/* Home Button */}
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleClose}
              sx={{
                marginTop: "16px",
                color: "white",
                "&:hover": {
                  backgroundColor: "#388e3c",
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default Checkout;
