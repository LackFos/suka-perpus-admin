import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Input } from "antd";
import { useState } from "react";
import useLogin from "../services/user/useLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState();

  const loginMutation = useLogin();

  const handleCredentialsChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginMutation.isPending) return;

    const response = await loginMutation.mutateAsync(credentials);

    localStorage.setItem("access_token", response.data.payload.access_token);

    navigate("/");
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-[#e6e6e6]'>
      <Card title='Login' bordered={false} style={{ width: 300 }}>
        <form onSubmit={handleLogin}>
          <div className='flex flex-col gap-2'>
            <Input
              onChange={(e) => handleCredentialsChange("email", e.target.value)}
              placeholder='Email'
              type='email'
              prefix={<MailOutlined />}
            />
            <Input
              onChange={(e) => handleCredentialsChange("password", e.target.value)}
              placeholder='Password'
              type='password'
              prefix={<LockOutlined />}
            />
          </div>

          <Button htmlType='submit' className='w-full mt-6' type='primary'>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
