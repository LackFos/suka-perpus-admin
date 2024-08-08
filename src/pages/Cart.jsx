import { BarcodeOutlined, CloseOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Image, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateBorrow from "../services/borrow/useCreateBorrow";

const Cart = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) ?? []);

  const [userId, setUserId] = useState("");

  const createBorrowMutation = useCreateBorrow();

  const handleRemoveFromCart = (book) => {
    const updatedCart = cart.filter((item) => item.id !== book.id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(JSON.parse(localStorage.getItem("cart")));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (createBorrowMutation.isPending) return;
    const booksId = cart.map((book) => book.id);
    await createBorrowMutation.mutateAsync({ data: { user_id: Number(userId), book_id: booksId } });

    setIsModalOpen(false);
    localStorage.removeItem("cart");
    navigate("/pinjam");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const errors = createBorrowMutation.isError ? createBorrowMutation.error : {};

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/buku");
    }
  }, [cart.length, navigate]);

  return (
    <>
      <Modal onOk={handleOk} onCancel={handleCancel} open={isModalOpen} title='Pinjam Sekarang'>
        <div className='flex flex-col gap-2 my-6'>
          <Input onChange={(e) => setUserId(e.target.value)} prefix={<UserOutlined />} placeholder='Masukkan User ID' />
          {errors?.user_id && <p className='text-red-600'>{errors.user_id}</p>}
        </div>
      </Modal>

      <div className='mx-4 mt-6 flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-4'>
          {cart.map((book) => (
            <Card key={book.id}>
              <div className='flex gap-6'>
                <Image width={200} height={210} className='rounded-lg' src={`${import.meta.env.VITE_API_ENDPOINT}${book.image}`} />

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
                    <Button type='primary' danger onClick={() => handleRemoveFromCart(book)}>
                      <CloseOutlined />
                      Batalkan
                    </Button>
                    <Button href={`/buku/${book.isbn}`} type='default'>
                      Detail
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={showModal} type='primary' className='mb-6'>
          Pinjam Sekarang
        </Button>
      </div>
    </>
  );
};

export default Cart;
