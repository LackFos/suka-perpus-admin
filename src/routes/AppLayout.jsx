import { BookOutlined, DashboardOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider } = Layout;

const AppLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const items = [
    {
      key: 1,
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      key: 2,
      icon: <SwapOutlined />,
      label: "Peminjaman",
      path: "pinjam",
      onClick: () => navigate("/pinjam"),
    },
    {
      key: 3,
      icon: <BookOutlined />,
      label: "Buku",
      children: [
        {
          key: 4,
          label: "Daftar Buku",
          onClick: () => navigate("/buku"),
        },
        {
          key: 5,
          label: "Tambah Buku",
          onClick: () => navigate("/tambah-buku"),
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout className='min-w-screen min-h-screen'>
      <Sider breakpoint='lg' collapsedWidth='0'>
        <h3 className='text-white pt-4 px-6 pb-6'>Suka Perpus</h3>
        <Menu theme='dark' mode='inline' defaultSelectedKeys={["4"]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className='flex w-full h-full justify-end items-center px-6'>
            <Button type='primary' className='bg-red-600' size='lg' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default AppLayout;
