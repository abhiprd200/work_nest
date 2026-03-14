
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkNestLogo } from '@/components/worknest/logo';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (role: 'user' | 'worker') => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing credentials",
        description: "Please enter your email and password.",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      router.push(`/dashboard/${role}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6">
            <WorkNestLogo iconOnly className="scale-125" />
          </Link>
          <h1 className="text-4xl font-headline font-black tracking-tight text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Log in to your WorkNest account</p>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted rounded-xl">
            <TabsTrigger value="user" className="rounded-lg font-bold">User</TabsTrigger>
            <TabsTrigger value="worker" className="rounded-lg font-bold">Professional</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                className="h-11 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="h-11 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="user">
            <Card className="border-none shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">Homeowner Login</CardTitle>
                <CardDescription>Access your dashboard and book services</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full h-12 text-lg font-bold rounded-lg shadow-lg shadow-primary/20" 
                  onClick={() => handleLogin('user')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="worker">
            <Card className="border-none shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">Professional Portal</CardTitle>
                <CardDescription>Access your job queue and manage schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full h-12 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-lg shadow-accent/20" 
                  onClick={() => handleLogin('worker')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In to Portal'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-primary font-black hover:underline">
            Register here
          </Link>
        </p>

        <div className="pt-4">
          <Button variant="ghost" asChild className="w-full font-bold">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
