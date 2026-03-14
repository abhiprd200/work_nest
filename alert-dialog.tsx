
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Hammer, Home } from 'lucide-react';
import { WorkNestLogo } from '@/components/worknest/logo';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function RegisterPage() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'user' | 'worker' | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialization: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      if (role === 'user') {
        const userRef = doc(firestore, 'userProfiles', user.uid);
        const profileData = {
          id: user.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          registrationDate: serverTimestamp(),
        };
        
        setDoc(userRef, profileData).catch(err => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: profileData
          }));
        });
      } else {
        const proRef = doc(firestore, 'serviceProfessionals', user.uid);
        const profileData = {
          id: user.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          registrationDate: serverTimestamp(),
          serviceCategoryIds: [formData.specialization],
          isAvailable: true,
          averageRating: 0,
        };

        setDoc(proRef, profileData).catch(err => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: proRef.path,
            operation: 'create',
            requestResourceData: profileData
          }));
        });
      }

      toast({
        title: "Account created!",
        description: `Welcome to WorkNest, ${formData.firstName}.`,
      });

      router.push(`/dashboard/${role}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-2xl text-center space-y-12">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <WorkNestLogo iconOnly className="scale-150 mx-auto" />
            </Link>
            <h1 className="text-5xl font-headline font-black tracking-tight">Join WorkNest</h1>
            <p className="text-xl text-muted-foreground font-body">Choose your path on the platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => setRole('user')}
              className="p-10 bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-primary group text-left relative overflow-hidden"
            >
              <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform">
                <Home className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-headline font-black mb-3">I'm a Homeowner</h3>
              <p className="text-muted-foreground leading-relaxed">Find trusted professionals and get your repairs done quickly with AI triage.</p>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowLeft className="h-6 w-6 rotate-180 text-primary" />
              </div>
            </button>
            <button 
              onClick={() => setRole('worker')}
              className="p-10 bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-accent group text-left relative overflow-hidden"
            >
              <div className="bg-accent/10 p-5 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform">
                <Hammer className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-3xl font-headline font-black mb-3">I'm a Professional</h3>
              <p className="text-muted-foreground leading-relaxed">Join our network, find jobs in your area, and grow your business with smart leads.</p>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowLeft className="h-6 w-6 rotate-180 text-accent" />
              </div>
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground font-semibold">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-black hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <WorkNestLogo iconOnly className="scale-125 mb-6" />
          </Link>
          <h1 className="text-4xl font-headline font-black tracking-tight">Create Account</h1>
          <p className="text-muted-foreground mt-2 font-semibold">Joining as a {role === 'user' ? 'Homeowner' : 'Professional'}</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="pt-10">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    required 
                    className="h-11 rounded-xl" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    required 
                    className="h-11 rounded-xl"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  required 
                  className="h-11 rounded-xl"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  className="h-11 rounded-xl"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              {role === 'worker' && (
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input 
                    id="specialization" 
                    name="specialization"
                    placeholder="e.g. Electrician, Plumber" 
                    required 
                    className="h-11 rounded-xl"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <Button 
                type="submit" 
                className={`w-full h-12 mt-4 text-lg font-bold rounded-xl shadow-lg ${role === 'worker' ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent/20' : 'bg-primary shadow-primary/20'}`}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 border-t pt-8 bg-muted/20">
            <p className="text-xs text-center text-muted-foreground leading-relaxed px-6">
              By creating an account, you agree to our <Link href="#" className="underline font-bold">Terms of Service</Link> and <Link href="#" className="underline font-bold">Privacy Policy</Link>.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setRole(null)} className="w-full font-bold" disabled={loading}>
              Change account type
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
