
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/worknest/navbar';
import { AITriage } from '@/components/worknest/ai-triage';
import { type ServiceTriageOutput } from '@/ai/flows/problem-triage-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Star, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { BookingModal } from '@/components/worknest/booking-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceReviewModal } from '@/components/worknest/service-review-modal';

export default function UserDashboard() {
  const { user } = useUser();
  const { firestore } = useFirestore();
  const [triageResult, setTriageResult] = useState<ServiceTriageOutput | null>(null);
  const [selectedPro, setSelectedPro] = useState<any | null>(null);
  const [reviewAppointment, setReviewAppointment] = useState<any | null>(null);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [firestore, user]);

  const { data: profile } = useDoc(profileRef);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'appointments'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: appointments } = useCollection(appointmentsQuery);

  const prosQuery = useMemoFirebase(() => {
    if (!firestore || !triageResult) return null;
    return query(
      collection(firestore, 'serviceProfessionals'), 
      where('serviceCategoryIds', 'array-contains', triageResult.serviceType)
    );
  }, [firestore, triageResult]);

  const { data: professionals } = useCollection(prosQuery);

  const activeAppointments = appointments?.filter(a => a.status !== 'completed' && a.status !== 'cancelled') || [];
  const completedAppointments = appointments?.filter(a => a.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Navbar role="user" />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-black">
            Welcome back, {profile?.firstName || 'Homeowner'}!
          </h1>
          <p className="text-muted-foreground">Manage your home and find the right help instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Triage and Filters */}
          <div className="lg:col-span-1 space-y-8">
            <section>
              <h2 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
                <span className="bg-accent w-1.5 h-6 rounded-full inline-block"></span>
                Need a Repair?
              </h2>
              <AITriage onTriageComplete={(res) => setTriageResult(res)} />
            </section>

            {/* Active Bookings (Tracking) */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-border">
              <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Ongoing Tracking
              </h3>
              <div className="space-y-3">
                {activeAppointments.length > 0 ? (
                  activeAppointments.map((app) => (
                    <div key={app.id} className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold">{app.serviceType}</p>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20">{app.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="h-3 w-3" />
                        {app.date ? new Date(app.date).toLocaleDateString() : 'Date TBD'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                    <p className="text-xs text-muted-foreground">No active bookings.</p>
                  </div>
                )}
              </div>
            </section>

            {/* After Delivery Section (History) */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-border">
              <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                After Delivery
              </h3>
              <div className="space-y-3">
                {completedAppointments.length > 0 ? (
                  completedAppointments.map((app) => (
                    <div key={app.id} className="p-3 bg-green-50/50 rounded-xl border border-green-100 text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold">{app.serviceType}</p>
                        <span className="text-[10px] text-green-600 font-bold uppercase">COMPLETED</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-3">
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                          <Calendar className="h-3 w-3" />
                          {app.date ? new Date(app.date).toLocaleDateString() : 'Date N/A'}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-[10px] font-black text-primary hover:text-primary hover:bg-primary/10 px-2 rounded-lg"
                          onClick={() => setReviewAppointment(app)}
                        >
                          <Star className="h-3 w-3 mr-1" /> RATE PRO
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                    <p className="text-xs text-muted-foreground">No completed services yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Search Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <span className="bg-primary w-1.5 h-6 rounded-full inline-block"></span>
                {triageResult ? `Top-Rated ${triageResult.serviceType}s` : "Recommended for You"}
              </h2>
              {triageResult && (
                <button onClick={() => setTriageResult(null)} className="text-xs text-muted-foreground hover:underline font-bold">
                  Clear search
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {professionals && professionals.length > 0 ? (
                professionals.map((pro) => (
                  <Card key={pro.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl group">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                        {pro.firstName?.charAt(0) || 'P'}
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <h3 className="text-xl font-headline font-black">{pro.firstName} {pro.lastName}</h3>
                          <Badge className="bg-accent/10 text-accent border-none font-bold uppercase tracking-tighter text-[10px]">VERIFIED</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                          <MapPin className="h-3 w-3" /> Professional in Your Area
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-1 pt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold">{pro.averageRating || 'New'}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setSelectedPro(pro)}
                        className="h-12 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group-hover:translate-x-1 transition-transform"
                      >
                        Book Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-20 text-center space-y-4 bg-muted/5 rounded-[2rem] border-4 border-dashed">
                  <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-headline font-black text-xl">
                    {triageResult ? `Searching for ${triageResult.serviceType}s...` : "Ready to help"}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                    {triageResult 
                      ? "Hang tight! We're connecting you to the best professionals in your neighborhood." 
                      : "Describe your home issue using the AI Assistant to see verified professionals."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedPro && triageResult && (
        <BookingModal 
          professional={selectedPro}
          isOpen={!!selectedPro}
          onClose={() => setSelectedPro(null)}
          serviceType={triageResult.serviceType}
        />
      )}

      {reviewAppointment && (
        <ServiceReviewModal 
          appointment={reviewAppointment}
          isOpen={!!reviewAppointment}
          onClose={() => setReviewAppointment(null)}
        />
      )}
    </div>
  );
}
