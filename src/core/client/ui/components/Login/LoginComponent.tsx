import React from "react";
import { Form, Input, Button, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/AuthenticationContext";

export const Login: React.FC = () => {
  const { signin, user, loginUserLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [form] = Form.useForm();
  if (user) navigate(from, { replace: true });

  const onFinish = async (values: { username: string; password: string }) => {
    const result = await signin(values.username, values.password);
    if (result.success) navigate("/");
    else
      notification.error({
        message: result.reason,
        duration: 3,
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 360, width: "100%" }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please enter your username" },
            {
              pattern: /^[^.]+\.[^.]+$/,
              message: "Username must be in the form firstname.lastname",
            },
          ]}
        >
          <Input
            placeholder="e.g. firstname.lastname"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="windows password"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => {
            const hasErrors = form
              .getFieldsError()
              .some(({ errors }) => errors.length > 0);
            const touchedAll = form.isFieldsTouched(
              ["username", "password"],
              true
            );
            return (
              <Button
                type="primary"
                htmlType="submit"
                loading={loginUserLoading}
                disabled={!touchedAll || hasErrors}
                block
              >
                Log in
              </Button>
            );
          }}
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(Login);
