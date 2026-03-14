
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/worknest/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, CheckCircle2, Star, User, Banknote, Loader2, MessageSquare } from 'lucide-react';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, writeBatch } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function WorkerDashboard() {
  const { user } = useUser();
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const proRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'serviceProfessionals', user.uid);
  }, [firestore, user]);

  const { data: profile } = useDoc(proRef);

  const jobsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'appointments'), where('serviceProfessionalId', '==', user.uid));
  }, [firestore, user]);

  const { data: jobs } = useCollection(jobsQuery);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'serviceProfessionals', user.uid, 'reviews'));
  }, [firestore, user]);

  const { data: reviews } = useCollection(reviewsQuery);

  const handleCompleteJob = async (job: any) => {
    if (!firestore || !user) return;
    setProcessingId(job.id);

    try {
      const batch = writeBatch(firestore);
      
      // Update appointment status
      const appRef = doc(firestore, 'appointments', job.id);
      batch.update(appRef, { status: 'completed' });

      await batch.commit();
      
      toast({
        title: "Service Completed",
        description: "Job marked as completed. Customer can now leave a review.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const earnings = jobs?.filter(j => j.status === 'completed').reduce((acc, curr) => acc + (curr.price || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Navbar role="worker" />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-headline font-black mb-2 uppercase tracking-tight">
            Professional Portal
          </h1>
          <p className="text-muted-foreground font-medium italic">
            Welcome back, {profile?.firstName || 'Professional'}. Your schedule awaits.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-lg bg-primary text-primary-foreground rounded-3xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Earnings</p>
                  <h3 className="text-3xl font-headline font-black">${earnings.toFixed(2)}</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-tighter bg-white/10 w-fit px-2 py-1 rounded-full">
                {jobs?.length || 0} Total Requests
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Completed</p>
                  <h3 className="text-3xl font-headline font-black">{jobs?.filter(j => j.status === 'completed').length || 0}</h3>
                </div>
                <div className="bg-accent/10 p-2 rounded-xl text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Pending</p>
                  <h3 className="text-3xl font-headline font-black">{jobs?.filter(j => j.status === 'pending').length || 0}</h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Rating</p>
                  <h3 className="text-3xl font-headline font-black">{profile?.averageRating || 'N/A'}</h3>
                </div>
                <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 border-b pb-4 mb-2">
              <h3 className="text-xl font-headline font-black uppercase tracking-tight">Active Job Queue</h3>
            </div>

            <div className="space-y-4">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <Card key={job.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden hover:bg-muted/5 transition-colors">
                    <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/5 p-4 rounded-2xl">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-headline font-bold text-lg">{job.serviceType}</h4>
                            <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black">{job.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(job.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3 text-right">
                        <div className="flex items-center gap-1 text-primary font-black text-xl">
                          <DollarSign className="h-4 w-4" />
                          {job.price?.toFixed(2) || '50.00'}
                        </div>
                        {job.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            className="rounded-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => handleCompleteJob(job)}
                            disabled={processingId === job.id}
                          >
                            {processingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Completed"}
                          </Button>
                        )}
                        {job.status === 'completed' && (
                          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-green-600 bg-green-50 px-2 py-1 rounded-md">
                            <CheckCircle2 className="h-3 w-3" />
                            Finished
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-24 text-center border-4 border-dashed rounded-[3rem] bg-muted/5">
                  <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-headline font-black text-xl">Your queue is empty</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto font-medium">
                    New job requests will appear here in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recent Reviews */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary/5 border-b pb-6 pt-8 px-8">
                <CardTitle className="text-xl font-headline font-black uppercase tracking-tight">Recent Reviews</CardTitle>
                <CardDescription className="font-bold text-xs">What customers are saying</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="space-y-2 border-b border-dashed pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn("h-3 w-3", s <= (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            {review.submissionDate ? new Date(review.submissionDate).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                        <p className="text-[10px] font-black text-primary">— {review.userName}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground italic leading-relaxed">
                        No service reviews yet. Complete your first jobs to start building your reputation!
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-dashed">
                  <div className="flex items-center gap-4">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <Banknote className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Mode Enabled</p>
                      <p className="text-sm font-bold">Cash on Delivery</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
