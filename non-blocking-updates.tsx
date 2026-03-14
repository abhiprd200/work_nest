
"use client";

import { useState } from 'react';
import { triageUserProblem, type ServiceTriageOutput } from '@/ai/flows/problem-triage-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Loader2, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AITriage({ onTriageComplete }: { onTriageComplete: (data: ServiceTriageOutput) => void }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServiceTriageOutput | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const output = await triageUserProblem({ problemDescription: description });
      setResult(output);
      onTriageComplete(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="h-5 w-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Assistant</span>
          </div>
          <CardTitle className="text-2xl font-headline">What can we help with today?</CardTitle>
          <CardDescription className="text-muted-foreground font-body">
            Describe your problem in detail (e.g., "The kitchen sink is leaking from the pipe underneath" or "Main breaker keeps tripping when I use the microwave")
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea 
              placeholder="Describe your issue here..."
              className="min-h-[120px] resize-none focus-visible:ring-accent border-muted text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 shadow-md"
              disabled={loading || !description.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing issue...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Find Specialists
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-accent/5 border-accent/20 animate-in fade-in slide-in-from-top-4 duration-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-accent/20 p-2 rounded-full mt-1">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-headline font-bold">
                  Recommended: <span className="text-primary">{result.serviceType}</span>
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.reasoning}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-accent uppercase tracking-tighter cursor-pointer hover:underline pt-2">
                  View {result.serviceType}s near you <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
