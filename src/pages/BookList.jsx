import { BarcodeOutlined, CloseOutlined, EditOutlined, SearchOutlined, ShoppingCartOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Card, Image, Input } from "antd";
import useGetBooks from "../services/book/useGetBooks";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";

const BookList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) ?? []);

  const books = useGetBooks({ search: searchParams.get("search") });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: keyword });
  };

  const handleAddToCart = (book) => {
    if (cart.every((item) => item.id !== book.id)) {
      localStorage.setItem("cart", JSON.stringify([...cart, book]));
    }
    setCart(JSON.parse(localStorage.getItem("cart")));
  };

  const handleRemoveFromCart = (book) => {
    const updatedCart = cart.filter((item) => item.id !== book.id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(JSON.parse(localStorage.getItem("cart")));
  };

  return (
    <>
      {cart.length > 0 && (
        <div className='fixed right-4 bottom-4 z-50'>
          <div className='relative'>
            <div className='bg-white border border-gray-400 h-4 w-4 absolute z-10 rounded-full text-xs top-0 right-0 flex justify-center items-center'>
              {cart.length}
            </div>
            <Button href='/keranjang' size='large' type='primary' shape='circle' icon={<ShoppingCartOutlined />} />
          </div>
        </div>
      )}

      <div className='ml-6 mx-4 flex flex-col gap-6 mt-6 '>
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <Input prefix={<SearchOutlined />} onChange={(e) => setKeyword(e.target.value)} placeholder='Cari Buku atau ISBN' />
          <Button type='primary'>Cari</Button>
        </form>

        <div className='grid grid-cols-2 gap-4'>
          {books.isLoading && <p>Memuat buku</p>}
          {books.isSuccess && books.data.length === 0 && <p>Belum ada buku</p>}
          {books.isSuccess &&
            books.data.map((book) => (
              <Card key={book.id}>
                <div className='flex gap-6'>
                  <div className='relative'>
                    {book.available_stock === 0 ? (
                      <div className='absolute z-10 px-2 py-1 bg-red-200 text-red-600 rounded-lg text-xs font-bold top-2 left-2'>
                        Tidak tersedia
                      </div>
                    ) : (
                      <div className='absolute z-10 px-2 py-1 bg-green-200 text-green-600 rounded-lg text-xs font-bold top-2 left-2'>
                        Sisa {book.available_stock}
                      </div>
                    )}
                    <Image width={150} height={210} className='rounded-lg' src={`${import.meta.env.VITE_API_ENDPOINT}${book.image}`} />
                  </div>

                  <div className='flex flex-col w-full justify-between'>
                    <ul className='flex flex-col gap-2'>
                      <li className='pb-2'>
                        <h4>{book.title}</h4>
                      </li>
                      <li className='flex gap-4 font-medium'>
                        <EditOutlined /> {book.author}
                      </li>
                      <li className='flex gap-4 font-medium'>
                        <BarcodeOutlined />
                        {book.isbn}
                      </li>
                    </ul>

                    <div className='flex flex-col gap-2'>
                      {cart.some((item) => item.id == book.id) ? (
                        <Button type='primary' danger onClick={() => handleRemoveFromCart(book)}>
                          <CloseOutlined />
                          Batalkan
                        </Button>
                      ) : (
                        <Button type='primary' onClick={() => handleAddToCart(book)}>
                          <SwapOutlined />
                          Pinjam
                        </Button>
                      )}
                      <Button type='default'>
                        <Link className='absolute left-0 top-0 w-full h-full flex justify-center items-center' to={`/buku/${book.isbn}`}>
                          Detail
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};

export default BookList;
