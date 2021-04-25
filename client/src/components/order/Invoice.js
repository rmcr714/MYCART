import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from '@david.kucsai/react-pdf-table'

const Invoice = ({ order }) => (
  <Document>
    <Page size='A4' style={styles.body}>
      <Text style={styles.header} fixed>
        ~{new Date().toLocaleString()}~
      </Text>
      <Text style={styles.title}>Order Invoice</Text>
      <Text style={styles.author}>My Cart</Text>

      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '3',
          marginLeft: '6',
        }}
      >
        Order Id : OD{order._id}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '3',
          marginLeft: '6',
        }}
      >
        Order Date : {order.createdAt}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '3',
          marginLeft: '6',
        }}
      >
        GST Number : {'27AABCU' + order.paymentIntent.created}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '10',
          marginLeft: '6',
        }}
      >
        Transaction Id: {order.paymentIntent.id}
      </Text>

      <Text
        style={{
          textAlign: 'left',
          fontSize: '13',
          marginBottom: '2',
          marginLeft: '6',
        }}
      >
        Billing Address
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '1',
          marginLeft: '6',
        }}
      >
        {order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '1',
          marginLeft: '6',
        }}
      >
        {order.shippingAddress.address}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '1',
          marginLeft: '6',
        }}
      >
        {order.shippingAddress.zip}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '1',
          marginLeft: '6',
        }}
      >
        {order.shippingAddress.state}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '1',
          marginLeft: '6',
        }}
      >
        {order.shippingAddress.city}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          margin: '1',
          marginLeft: '6',
        }}
      >
        {order.shippingAddress.phone}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: '10',
          marginBottom: '1',
          marginLeft: '6',
        }}
      >
        {order.shippingAddress.email}
      </Text>

      <Text
        style={{
          fontSize: '18',
          marginTop: '12',
          marginLeft: '6',
          marginBottom: '12',
        }}
      >
        Order Summary
      </Text>
      <Table>
        <TableHeader>
          <TableCell>Title</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Brand</TableCell>
          <TableCell>Color</TableCell>
        </TableHeader>
      </Table>
      <Table data={order.products}>
        <TableBody>
          <DataTableCell getContent={(x) => x.product.title} />

          <DataTableCell
            getContent={(x) => `$${x.product.price} x (${x.count})`}
          />
          <DataTableCell getContent={(x) => x.count} />
          <DataTableCell getContent={(x) => x.product.brand} />
          <DataTableCell getContent={(x) => x.product.color} />
        </TableBody>
      </Table>

      <Text
        style={{
          textAlign: 'left',
          marginTop: '10',
          marginBottom: '2',
          marginLeft: '8',
          fontSize: '12',
        }}
      >
        Order Status : {order.orderStatus}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          marginBottom: '2',
          marginLeft: '8',
          fontSize: '12',
        }}
      >
        Total Paid : ${order.totalPrice}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          marginBottom: '2',
          marginLeft: '8',
          fontSize: '12',
        }}
      >
        Payment status : {order.paymentIntent.status}
      </Text>
      <Text
        style={{
          textAlign: 'right',
          marginTop: '14',
          marginBottom: '4',
          marginLeft: '8',
          fontSize: '12',
        }}
      >
        Need Help?
      </Text>
      <Text
        style={{
          textAlign: 'right',
          marginBottom: '2',
          marginLeft: '8',
          fontSize: '12',
        }}
      >
        Contact us toll free : 1800 3424 43234
      </Text>
      <Text
        style={{
          textAlign: 'right',
          marginBottom: '2',
          marginLeft: '8',
          fontSize: '12',
        }}
      >
        email us : mycartquery@gmail.com
      </Text>
      <Text style={styles.footer}>~Thankyou for shopping with us~</Text>
    </Page>
  </Document>
)
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  footer: {
    padding: '100px',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
})

export default Invoice
