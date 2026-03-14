
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export function FeedbackForm() {
  const { firestore } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    setLoading(true);

    const feedbackData = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    const feedbackCol = collection(firestore, 'feedback');
    addDocumentNonBlocking(feedbackCol, feedbackData);

    // Briefly wait for a smooth transition
    await new Promise(resolve => setTimeout(resolve, 800));

    setLoading(false);
    setSubmitted(true);
    
    toast({
      title: "Feedback Sent!",
      description: "Thank you for helping us improve WorkNest.",
    });
  };

  if (submitted) {
    return (
      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <CardContent className="p-12 text-center space-y-6">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-3xl font-headline font-black">Thank You!</h3>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto">
            Your feedback has been sent directly to our team at <span className="text-primary font-bold">8292aniarc@gmail.com</span>. We'll review it shortly!
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', message: '' });
            }}
            className="rounded-xl font-bold"
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
      <CardContent className="p-8 md:p-12 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="feedback-name" className="font-bold">Name</Label>
              <Input 
                id="feedback-name" 
                placeholder="Your name" 
                className="h-12 rounded-xl border-muted bg-muted/10"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-email" className="font-bold">Email</Label>
              <Input 
                id="feedback-email" 
                type="email" 
                placeholder="your@email.com" 
                className="h-12 rounded-xl border-muted bg-muted/10"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback-message" className="font-bold">Your Thoughts</Label>
            <Textarea 
              id="feedback-message" 
              placeholder="What are we doing well? What can we improve?" 
              className="min-h-[150px] rounded-xl border-muted bg-muted/10 resize-none p-4"
              required
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 group"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Submit Feedback 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground font-medium italic">
            Feedback is sent to 8292aniarc@gmail.com
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
