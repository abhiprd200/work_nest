
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
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ServiceReviewModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceReviewModal({ appointment, isOpen, onClose }: ServiceReviewModalProps) {
  const { user } = useUser();
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmitReview = async () => {
    if (!firestore || !user) return;
    if (!comment.trim()) {
      toast({ variant: "destructive", title: "Review missing", description: "Please leave a comment." });
      return;
    }

    setLoading(true);
    
    const reviewData = {
      appointmentId: appointment.id,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Homeowner',
      serviceProfessionalId: appointment.serviceProfessionalId,
      rating,
      comment,
      submissionDate: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    try {
      // Add to pro's specific reviews collection
      const reviewsCol = collection(firestore, 'serviceProfessionals', appointment.serviceProfessionalId, 'reviews');
      addDocumentNonBlocking(reviewsCol, reviewData);
      
      setSuccess(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-black">How was your service?</DialogTitle>
              <DialogDescription>
                Share your experience with the {appointment.serviceType} professional.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label className="font-bold">Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8",
                          s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-comment" className="font-bold">Your Comments</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Tell us what went well or how they can improve..."
                  className="min-h-[100px] rounded-xl border-muted bg-muted/5 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSubmitReview} 
                disabled={loading}
                className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit Review"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-12 text-center space-y-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black">Review Published!</h3>
              <p className="text-muted-foreground">
                Thank you for your feedback. It helps the community and the professional.
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
