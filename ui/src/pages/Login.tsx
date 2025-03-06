import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [authRegisterStatus, setAuthRegisterStatus] = useState(false);
  const navigate = useNavigate();

  const handleSubmitRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error", error);
    }
  };
  const handleSubmitLogim = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleToggle = () => {};

  return (
    <div className="flex flex-col">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="flex border border-dark rounded-full mx-auto mb-4 p-[.3rem]">
        <Button
          variant={authRegisterStatus ? "default" : "outline"}
          className="border-none rounded-full"
          onClick={() => setAuthRegisterStatus(true)}
        >
          Register
        </Button>
        <Button
          className="border-none rounded-full"
          variant={!authRegisterStatus ? "default" : "outline"}
          onClick={() => setAuthRegisterStatus(false)}
        >
          Login
        </Button>
      </div>

      {authRegisterStatus ? (
        <form
          className="p-4 border border-dark flex flex-col justify-between gap-4 mx-3 min-h-[60vh]"
          onSubmit={handleSubmitRegister}
        >
          <h1 className="text-2xl font-bold">Register</h1>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <Button className="px-4" type="submit">
            Register
          </Button>
        </form>
      ) : (
        <form
          className="p-4 border border-dark flex flex-col justify-between gap-4 mx-3 min-h-[60vh]"
          onSubmit={handleSubmitLogim}
        >
          <h1 className="text-2xl font-bold">Login</h1>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <Button className="px-4" type="submit">
            Login
          </Button>
        </form>
      )}
    </div>
  );
}

export default Login;
