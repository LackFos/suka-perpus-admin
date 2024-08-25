import {
  BookOutlined,
  CalendarOutlined,
  IdcardFilled,
  SearchOutlined,
  SwapOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, DatePicker, Input, Select } from "antd";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import useGetBorrows from "../services/borrow/useGetBorrows";
import useReturnBorrow from "../services/borrow/useReturnBorrow";
import dayjs from "dayjs";

const BorrowList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    borrow_id: searchParams.get("borrow_id"),
    user_id: searchParams.get("user_id"),
    status_id: searchParams.get("status_id"),
    startDate: searchParams.get("startDate") ? dayjs(searchParams.get("startDate")) : undefined,
  });

  const borrows = useGetBorrows({
    borrow_id: searchParams.get("borrow_id"),
    user_id: searchParams.get("user_id"),
    status_id: searchParams.get("status_id"),
    startDate: searchParams.get("startDate"),
  });

  const returnBorrowMutation = useReturnBorrow();

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedSearchParams = {};
    if (filters.borrow_id) updatedSearchParams.borrow_id = filters.borrow_id;
    if (filters.user_id) updatedSearchParams.user_id = filters.user_id;
    if (filters.status_id) updatedSearchParams.status_id = filters.status_id;
    if (filters.startDate) updatedSearchParams.startDate = filters.startDate.format("YYYY-MM-DD");

    setSearchParams(updatedSearchParams);
  };

  const handleFilterChange = (filter, value) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  const handleReturnBorrow = (id) => {
    if (returnBorrowMutation.isPending) return;
    returnBorrowMutation.mutate({ id });
  };

  const state = {
    Borrowing: { label: "Dipinjam", style: "bg-yellow-200 text-yellow-600" },
    Returned: { label: "Dikembalikan", style: "bg-green-200 text-green-600" },
  };

  const statusOptions = [
    { label: "Dipinjam", value: "1" },
    { label: "Dikembalikan", value: "2" },
  ];

  return (
    <div className='ml-6 mx-4 flex flex-col gap-6 mt-6 '>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <Input
          onChange={(e) => handleFilterChange("borrow_id", e.target.value)}
          value={filters.borrow_id}
          className='w-full'
          prefix={<SwapOutlined />}
          placeholder='Cari id peminjaman'
          allowClear
        />
        <Input
          onChange={(e) => handleFilterChange("user_id", e.target.value)}
          value={filters.user_id}
          className='w-full'
          prefix={<UserOutlined />}
          placeholder='Cari id user'
          allowClear
        />
        <Select
          onChange={(value) => handleFilterChange("status_id", value)}
          value={statusOptions.find((option) => option.value === filters.status_id)?.label}
          className='w-full'
          placeholder='Pilih Status'
          options={statusOptions}
          allowClear
        />
        <DatePicker
          onChange={(value) => handleFilterChange("startDate", value)}
          value={filters.startDate}
          format={"YYYY-MM-DD"}
          className='w-full'
          placeholder='Pilih Tanggal'
        />
        <Button htmlType='submit' type='primary'>
          Cari
        </Button>
      </form>

      <div className='grid grid-cols-1 gap-4'>
        {borrows.isLoading && <p>Memuat data...</p>}
        {borrows.isSuccess && borrows.data.length === 0 && <p>Belum ada Peminjaman</p>}
        {borrows.isSuccess &&
          borrows.data.map((borrow) => (
            <Card key={borrow.id}>
              <div className='flex gap-6'>
                <div className='flex flex-col w-full justify-between'>
                  <ul className='flex flex-col gap-2'>
                    <li className='pb-2'>
                      <h4>{borrow.user.name}</h4>
                    </li>
                    <li className='flex gap-2 text-xs font-medium'>
                      <SwapOutlined /> Id Peminjaman : {borrow.user.id}
                    </li>
                    <li className='flex gap-2 text-xs font-medium'>
                      <UserOutlined /> Id User : {borrow.user.id}
                    </li>
                    <li className='flex gap-2 text-xs font-medium'>
                      <CalendarOutlined />
                      Tanggal Peminjaman : {new Date(borrow.created_at).toLocaleDateString("id-ID")}
                    </li>
                    <li className='flex gap-2 text-xs font-medium'>
                      <BookOutlined />
                      Jumlah Buku : {borrow.books.length}
                    </li>
                    <ul className='bg-gray-100 rounded-lg p-4'>
                      {borrow.books.map((book) => (
                        <li className='flex gap-2 text-xs font-medium' key={book.id}>
                          - {book.title}
                        </li>
                      ))}
                    </ul>
                  </ul>
                </div>

                <div className='flex flex-col justify-between items-end'>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${state[borrow.borrow_status.name].style}`}>
                    {state[borrow.borrow_status.name].label}
                  </div>

                  {borrow.borrow_status.name === "Borrowing" && (
                    <>
                      <div className='text-red-600 whitespace-nowrap'>
                        Denda : {borrow.penalty_fee ? `Rp ${borrow.penalty_fee.toLocaleString("id-ID")}` : "-"}
                      </div>

                      <Button onClick={() => handleReturnBorrow(borrow.id)} type='primary'>
                        Kembalikan
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default BorrowList;
