
'use client';

import { useState } from 'react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquare, Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';

export function ReviewsSection() {
  const { user } = useUser();
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'platform_reviews'), orderBy('submissionDate', 'desc'), limit(12));
  }, [firestore]);

  const { data: reviews, isLoading } = useCollection(reviewsQuery);

  const handleAddReview = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please sign in to leave a review.",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Review is empty",
        description: "Please share your thoughts before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    const reviewData = {
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Anonymous User',
      rating,
      comment,
      submissionDate: new Date().toISOString(),
      appointmentId: 'platform_feedback',
      serviceProfessionalId: 'worknest_platform'
    };

    const reviewsCol = collection(firestore!, 'platform_reviews');
    addDocumentNonBlocking(reviewsCol, reviewData);
    
    toast({
      title: "Review Published",
      description: "Thank you for sharing your experience with the community!",
    });
    
    setIsDialogOpen(false);
    setComment('');
    setRating(5);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-headline font-black md:text-5xl">Community Reviews</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto md:mx-0">
            Hear from our homeowners and professionals about their journey with WorkNest.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-5 w-5" /> Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-headline">Share Your Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="font-bold">Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8",
                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted border-muted"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-comment" className="font-bold">Your Review</Label>
                <Textarea
                  id="review-comment"
                  placeholder="How was your experience using WorkNest?"
                  className="min-h-[120px] rounded-xl border-muted bg-muted/10"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddReview} 
                disabled={isSubmitting}
                className="w-full h-12 font-bold rounded-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Post Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary/50" />
          <p className="text-muted-foreground font-semibold">Loading reviews...</p>
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur-sm group hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                    {new Date(review.submissionDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{review.comment}"
                </p>
                <div className="pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                    {review.userName?.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-headline font-bold text-foreground">
                    {review.userName}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border-4 border-dashed rounded-[3rem] bg-muted/5 max-w-4xl mx-auto px-6">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-3xl font-headline font-black mb-4">No reviews yet</h3>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto mb-8">
            Our platform is brand new! Be the first to share your experience and help others discover WorkNest.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
            className="rounded-xl font-bold border-2 h-12 px-8 hover:bg-primary hover:text-white transition-all"
          >
            Leave the first review
          </Button>
        </div>
      )}
    </div>
  );
}
