import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { SaveFilled, UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Image, Input, InputNumber, Upload } from "antd";
import useCreateBook from "../services/book/useCreateBook";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const BookCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: undefined,
    title: undefined,
    isbn: undefined,
    author: undefined,
    publisher: undefined,
    publication_date: undefined,
    stock: undefined,
    description: undefined,
  });

  const createBookMutation = useCreateBook();

  const handleCreateBook = (e) => {
    e.preventDefault();
    if (createBookMutation.isPending) return;
    createBookMutation.mutate({ data: { ...formData, publication_date: formData.publication_date?.format("YYYY-MM-DD") } });
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const errors = createBookMutation.isError ? createBookMutation.error : {};

  useEffect(() => {
    if (createBookMutation.isSuccess) {
      navigate(`/buku/${createBookMutation.data.payload.isbn}`);
    }
  }, [createBookMutation.isSuccess, navigate, createBookMutation.data]);
  console.log(formData);

  return (
    <form onSubmit={handleCreateBook} className='flex flex-col rounded-lg mx-6 my-4 bg-white p-6'>
      <div className='mb-6'>
        <Title level={3}>Tambah Buku</Title>
      </div>

      <div className='flex flex-col gap-1 mb-6'>
        <div className='flex'>
          <div className='flex bg-gray-300 rounded-lg overflow-hidden'>
            <Image width={200} height={290} />
          </div>
        </div>

        <Upload maxCount={1} onChange={(value) => handleFormDataChange("image", value.file.originFileObj)} name='image'>
          <Button icon={<UploadOutlined />}>Upload Gambar</Button>
        </Upload>
        {errors?.image && <p className='text-red-600'>{errors.image}</p>}
      </div>

      <div className='flex flex-col gap-4 mb-12'>
        <label className='flex flex-col gap-1'>
          <p>Nama Buku</p>
          <Input value={formData.title} onChange={(e) => handleFormDataChange("title", e.target.value)} className='w-full' />
          {errors?.title && <p className='text-red-600'>{errors.title}</p>}
        </label>

        <label className='flex flex-col gap-1'>
          <p>ISBN</p>
          <Input value={formData.isbn} onChange={(e) => handleFormDataChange("isbn", e.target.value)} className='w-full' />
          {errors?.isbn && <p className='text-red-600'>{errors.isbn}</p>}
        </label>

        <label className='flex flex-col gap-1'>
          <p>Penulis</p>
          <Input value={formData.author} onChange={(e) => handleFormDataChange("author", e.target.value)} className='w-full' />
          {errors?.author && <p className='text-red-600'>{errors.author}</p>}
        </label>

        <label className='flex flex-col gap-1'>
          <p>Penerbit</p>
          <Input value={formData.publisher} onChange={(e) => handleFormDataChange("publisher", e.target.value)} className='w-full' />
          {errors?.publisher && <p className='text-red-600'>{errors.publisher}</p>}
        </label>

        <label className='flex flex-col gap-1'>
          <p>Tanggal Terbit</p>
          <DatePicker
            value={formData.publication_date}
            onChange={(value) => handleFormDataChange("publication_date", value)}
            format={"DD-MM-YYYY"}
            placeholder=''
            className='w-full'
          />
          {errors?.publication_date && <p className='text-red-600'>{errors.publication_date}</p>}
        </label>

        <label className='flex flex-col gap-1'>
          <p>Stok</p>
          <InputNumber value={formData.stock} onChange={(value) => handleFormDataChange("stock", value)} min={1} className='w-full' />
          {errors?.stock && <p className='text-red-600'>{errors.stock}</p>}
        </label>

        <label className='flex flex-col gap-1'>
          <p>Deskripsi</p>
          <TextArea value={formData.description} onChange={(e) => handleFormDataChange("description", e.target.value)} className='w-full' />
          {errors?.description && <p className='text-red-600'>{errors.description}</p>}
        </label>
      </div>

      <Button htmlType='submit' type='primary'>
        <SaveFilled />
        Tambah Buku
      </Button>
    </form>
  );
};

export default BookCreate;
