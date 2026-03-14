
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, CreditCard, Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  professional: any;
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
}

export function BookingModal({ professional, isOpen, onClose, serviceType }: BookingModalProps) {
  const { user } = useUser();
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const handleBooking = async () => {
    if (!firestore || !user || !date) return;

    setLoading(true);
    
    const appointmentData = {
      userId: user.uid,
      serviceProfessionalId: professional.id,
      serviceType: serviceType,
      status: 'pending',
      date: date.toISOString(),
      price: 50, // Standard base price for MVP
      createdAt: serverTimestamp(),
    };

    try {
      const appRef = await addDocumentNonBlocking(collection(firestore, 'appointments'), appointmentData);
      
      const paymentData = {
        appointmentId: appRef?.id || 'pending_ref',
        userId: user.uid,
        serviceProfessionalId: professional.id,
        amount: 50,
        method: 'Cash on Delivery',
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      addDocumentNonBlocking(collection(firestore, 'payments'), paymentData);
      
      setStep('success');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-black">Book Service</DialogTitle>
              <DialogDescription>
                Schedule your {serviceType} session with {professional.firstName}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label className="font-bold">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 rounded-xl border-muted",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-dashed flex justify-between items-center">
                <span className="text-sm font-semibold">Service Fee</span>
                <span className="text-lg font-black text-primary">$50.00</span>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setStep('payment')} className="w-full h-12 font-bold rounded-xl">
                Continue to Payment
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-black">Payment Method</DialogTitle>
              <DialogDescription>
                Choose how you'd like to pay for your service.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-4 border-2 border-primary bg-primary/5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Cash on Delivery</h4>
                  <p className="text-xs text-muted-foreground">Pay the professional after the job is done.</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
              </div>
              
              <div className="p-4 border border-muted bg-muted/10 rounded-2xl flex items-center gap-4 opacity-50 cursor-not-allowed">
                <div className="bg-muted p-3 rounded-full">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-muted-foreground">Credit Card</h4>
                  <p className="text-[10px] text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2">
              <Button 
                onClick={handleBooking} 
                disabled={loading}
                className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm Booking"}
              </Button>
              <Button variant="ghost" onClick={() => setStep('details')} className="w-full font-bold">
                Back to details
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <div className="py-12 text-center space-y-6">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your appointment with {professional.firstName} is set for {date ? format(date, "MMM do") : 'soon'}.
              </p>
            </div>
            <Button onClick={onClose} className="w-full h-12 font-bold rounded-xl">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
