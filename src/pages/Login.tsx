import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Crown, Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuthHook";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (user && !authLoading) navigate(isAdmin ? "/admin" : "/dashboard");
  }, [user, authLoading, isAdmin, navigate]);

  // Form validation
  const validateForm = () => {
    try {
      if (isLogin) loginSchema.parse({ email: formData.email, password: formData.password });
      else signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => { if (e.path[0]) newErrors[e.path[0] as string] = e.message; });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) toast({ title: "Login Failed", description: error, variant: "destructive" });
        else toast({ title: "Welcome back!", description: "Redirecting..." });
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.name, formData.phone);
        if (error) toast({ title: "Sign Up Failed", description: error, variant: "destructive" });
        else {
          toast({ title: "Account created!", description: "You can now login." });
          setIsLogin(true);
        }
      }
    } catch {
      toast({ title: "Error", description: "Unexpected error occurred", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-primary to-navy-dark">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--accent)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-primary-foreground/70 hover:text-primary-foreground">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Card className="shadow-elevated border-border/20 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
                <Crown className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
            <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>{isLogin ? "Sign in to access your dashboard" : "Join Royal Hills PG today"}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}

                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                </>
              )}

              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}

              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}

              <Button type="submit" disabled={loading} className="w-full">{loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}</Button>
            </form>

            <div className="mt-6 text-center">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} className="text-accent font-semibold hover:underline">{isLogin ? "Sign Up" : "Sign In"}</button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-primary-foreground/50 text-sm mt-8">© 2024 Royal Hills PG. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
