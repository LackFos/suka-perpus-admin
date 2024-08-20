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
import { Helmet } from "react-helmet";

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
        element: (
          <>
            <Helmet>
              <title>Login | Suka Perpus</title>
            </Helmet>
            <Login />
          </>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/",
                element: (
                  <>
                    <Helmet>
                      <title>Dashboard | SukaPerpus</title>
                    </Helmet>
                    <Dashboard />,
                  </>
                ),
              },
              {
                path: "/buku",
                element: (
                  <>
                    <Helmet>
                      <title>Daftar Buku | SukaPerpus</title>
                    </Helmet>
                    <BookList />,
                  </>
                ),
              },
              {
                path: "/buku/:isbn",
                element: (
                  <>
                    <Helmet>
                      <title>Detail Buku | SukaPerpus</title>
                    </Helmet>
                    <BookDetail />
                  </>
                ),
              },
              {
                path: "/tambah-buku",
                element: (
                  <>
                    <Helmet>
                      <title>Tambah Buku | SukaPerpus</title>
                    </Helmet>
                    <BookCreate />,
                  </>
                ),
              },
              {
                path: "/pinjam",
                element: (
                  <>
                    <Helmet>
                      <title>Daftar Peminjaman | SukaPerpus</title>
                    </Helmet>
                    <BorrowList />,
                  </>
                ),
              },
              {
                path: "/keranjang",
                element: (
                  <>
                    <Helmet>
                      <title>List Peminjaman | SukaPerpus</title>
                    </Helmet>
                    <Cart />,
                  </>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];
