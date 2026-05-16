import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Register = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // ❗ email check
  if (!email) {
    toast.error("Session expired. Please signup again ❌");
    navigate("/signup");
  }

  const handleRegister = async (e: any) => {
    e.preventDefault();

    // ❗ validation
    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      await api.register(email, password);

      toast.success("Password set successfully ✅");

      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Register failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle>Set Your Password</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">

            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full gradient-pink text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Set Password"}
            </Button>

          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;