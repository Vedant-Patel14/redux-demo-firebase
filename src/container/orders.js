import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase";
import { getDocs, collection, query, where, getDoc } from 'firebase/firestore'; 
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Orders = () => {
  const user = useSelector(state => state.user); 
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {

    const fetchOrders = async () => {
      try {
          const ordersCollectionRef = collection(db, "orders" ,"userOrders" );
          const ordersSnapshot = await getDoc(ordersCollectionRef);
          // const q = query(ordersCollectionRef, where("userOrders"));
          console.log('first', ordersSnapshot)

          if (ordersSnapshot.exists()) {
            console.log("Document data:", ordersSnapshot.data());
          } else {
            console.log("No such document!");
          }
      
          const orders = [];

          ordersSnapshot.forEach((orderDoc) => {
            const orderData = orderDoc.data();
            console.log('Fetched order:', orderData);
            const { category, date, price } = orderData;
            orders.push({ category, date, price });
          });

          console.log('Fetched orders:', orders); 
          setOrdersData(orders);
        
      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <Container>
      {/* All Orders */}
      <Box><h2><b> All Orders</b></h2></Box>

      {/* Title of Orders */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ordersData.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order.category}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Orders;
