import { Card } from "antd";
import Title from "antd/es/typography/Title";
import useGetStats from "../services/stats/useGetStats";

const Dashboard = () => {
  const stats = useGetStats();

  return (
    <>
      {stats.isSuccess ? (
        <div className='flex mt-4 mx-6 gap-4'>
          <Card className='w-full shadow-sm' title='Buku dipinjam'>
            <Title level={3}>{stats.data.borrow_count ?? 0}</Title>
          </Card>
          <Card className='w-full shadow-sm' title='Telat dikembalikan'>
            <Title level={3}>{stats.data.overdue_count ?? 0}</Title>
          </Card>
          <Card className='w-full shadow-sm' title='Total Buku'>
            <Title level={3}>{stats.data.book_count ?? 0}</Title>
          </Card>
        </div>
      ) : (
        <div className='mt-4 mx-6'>
          <p>Memuat data</p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
