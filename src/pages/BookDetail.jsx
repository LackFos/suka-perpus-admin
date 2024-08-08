import { useEffect, useState } from "react";
import { DeleteFilled, EditFilled, UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Image, Input, InputNumber, Upload } from "antd";
import Title from "antd/es/typography/Title";
import useGetBook from "../services/book/useGetBook";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import useUpdateBook from "../services/book/useUpdateBook";
import useDeleteBook from "../services/book/useDeleteBook";
import TextArea from "antd/es/input/TextArea";
import bookKeys from "../services/book/cacheKeys";

const BookDetail = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: undefined,
    title: undefined,
    isbn: undefined,
    author: undefined,
    publisher: undefined,
    publication_date: undefined,
    stock: undefined,
  });

  const book = useGetBook(isbn);
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  const handleUpdateBook = (e) => {
    e.preventDefault();
    if (updateBookMutation.isPending || deleteBookMutation.isPending) return;
    updateBookMutation.mutate({
      id: book.data.id,
      data: { ...formData, publication_date: formData.publication_date?.format("YYYY-MM-DD") },
      cacheKey: bookKeys.detail(isbn),
    });
  };

  const handleDeleteBook = () => {
    if (updateBookMutation.isPending || deleteBookMutation.isPending) return;
    deleteBookMutation.mutate({ id: book.data.id, cacheKey: bookKeys.detail(isbn) });
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const errors = updateBookMutation.isError ? updateBookMutation.error : {};

  useEffect(() => {
    if (deleteBookMutation.isSuccess) {
      navigate("/buku");
    }
  }, [deleteBookMutation.isSuccess, navigate]);

  return (
    <div className='flex flex-col rounded-lg mx-6 my-4 bg-white p-6'>
      {book.isSuccess && (
        <form onSubmit={handleUpdateBook}>
          <div className='mb-6'>
            <Title level={3}>Detail Buku</Title>
          </div>

          <div className='flex flex-col gap-1 mb-6'>
            <Image width={200} height={290} className='rounded-lg' src={`${import.meta.env.VITE_API_ENDPOINT}${book.data.image}`} />

            <Upload name='image'>
              <Button icon={<UploadOutlined />}>Upload Gambar</Button>
            </Upload>

            {errors?.image && <p className='text-red-600'>{errors.image}</p>}
          </div>

          <div className='flex flex-col gap-4 mb-12'>
            <label className='flex flex-col gap-1'>
              <p className='text-gray-500'>Nama Buku</p>
              <Input
                value={formData.title || book.data.title}
                onChange={(e) => handleFormDataChange("title", e.target.value)}
                className='w-full'
              />
              {errors?.title && <p className='text-red-600'>{errors.title}</p>}
            </label>

            <label className='flex flex-col gap-1'>
              <p className='text-gray-500'>ISBN</p>
              <Input
                value={formData.isbn || book.data.isbn}
                onChange={(e) => handleFormDataChange("isbn", e.target.value)}
                className='w-full'
              />
              {errors?.isbn && <p className='text-red-600'>{errors.isbn}</p>}
            </label>

            <label className='flex flex-col gap-1'>
              <p className='text-gray-500'>Penulis</p>
              <Input
                value={formData.author || book.data.author}
                onChange={(e) => handleFormDataChange("author", e.target.value)}
                className='w-full'
              />
              {errors?.author && <p className='text-red-600'>{errors.author}</p>}
            </label>

            <label className='flex flex-col gap-1'>
              <p className='text-gray-500'>Penerbit</p>
              <Input
                value={formData.publisher || book.data.publisher}
                onChange={(e) => handleFormDataChange("publisher", e.target.value)}
                className='w-full'
              />
              {errors?.publisher && <p className='text-red-600'>{errors.publisher}</p>}
            </label>

            <label className='flex flex-col gap-1'>
              <p className='text-gray-500'>Tanggal Terbit</p>
              <DatePicker
                value={dayjs(formData.publication_date || book.data.publication_date)}
                onChange={(value) => handleFormDataChange("publication_date", value)}
                format={"DD-MM-YYYY"}
                placeholder=''
                className='w-full'
              />
              {errors?.publication_date && <p className='text-red-600'>{errors.publication_date}</p>}
            </label>

            <label className='flex flex-col gap-1'>
              <p className='text-gray-500'>Stok</p>
              <InputNumber
                value={formData.stock || book.data.stock}
                onChange={(value) => handleFormDataChange("stock", value)}
                min={1}
                className='w-full'
              />
              {errors?.stock && <p className='text-red-600'>{errors.stock}</p>}
            </label>

            <label className='flex flex-col gap-1'>
              <p>Deskripsi</p>
              <TextArea
                value={formData.description}
                onChange={(e) => handleFormDataChange("description", e.target.value)}
                className='w-full'
              />
              {errors?.description && <p className='text-red-600'>{errors.description}</p>}
            </label>
          </div>

          <div className='flex flex-col gap-2'>
            <Button htmlType='submit' className='w-full' type='primary'>
              <EditFilled /> Edit Buku
            </Button>

            <Button danger onClick={handleDeleteBook} className='w-full' type='primary'>
              <DeleteFilled /> Hapus Buku
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookDetail;
