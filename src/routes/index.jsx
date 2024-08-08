import { Bounce, ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProctectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import BookList from "../pages/BookList";
import BookDetail from "../pages/BookDetail";
import BookCreate from "../pages/BookCreate";
import Cart from "../pages/Cart";
import BorrowList from "../pages/BorrowList";

export default [
  {
    element: (
      <>
        <ToastContainer position='top-right' autoClose={3000} draggable={true} transition={Bounce} pauseOnHover={false} />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "/buku",
                element: <BookList />,
              },
              {
                path: "/buku/:isbn",
                element: <BookDetail />,
              },
              {
                path: "/tambah-buku",
                element: <BookCreate />,
              },
              {
                path: "/pinjam",
                element: <BorrowList />,
              },
              {
                path: "/keranjang",
                element: <Cart />,
              },
            ],
          },
        ],
      },
    ],
  },
];
