
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, Star, ArrowRight, MessageSquare } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WorkNestLogo } from '@/components/worknest/logo';
import { FeedbackForm } from '@/components/worknest/feedback-form';
import { ReviewsSection } from '@/components/worknest/reviews-section';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/">
          <WorkNestLogo />
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-8">
          <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="/auth/login">
            Login
          </Link>
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90 font-bold px-6">
            <Link href="/auth/register">Join as Professional</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold animate-in fade-in slide-in-from-left-4 duration-500">
                    <Zap className="h-4 w-4 fill-current" />
                    <span>Intelligent Home Services</span>
                  </div>
                  <h1 className="text-4xl font-headline font-black tracking-tight sm:text-6xl xl:text-7xl text-foreground leading-[1.1]">
                    Reliable Help, <br />
                    <span className="text-primary">Powered by AI</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl font-body leading-relaxed">
                    WorkNest connects you with trusted professionals for emergencies or routine maintenance. Describe your problem, and let our AI handle the rest.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 h-14 px-8 text-lg font-bold">
                    <Link href="/dashboard/user">Get Help Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-primary/20 text-primary hover:bg-primary/5 h-14 px-8 text-lg font-bold">
                    <Link href="/auth/register">Become a Professional</Link>
                  </Button>
                </div>
              </div>
              <div className="relative group lg:ml-auto">
                <div className="absolute -inset-10 bg-accent/20 rounded-full blur-3xl opacity-50 group-hover:bg-accent/30 transition-all duration-700"></div>
                {heroImage && (
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                    <Image
                      alt={heroImage.description}
                      className="mx-auto aspect-[4/3] object-cover"
                      height={600}
                      src={heroImage.imageUrl}
                      width={800}
                      data-ai-hint={heroImage.imageHint}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent mb-2 uppercase tracking-widest">
                  Process
                </div>
                <h2 className="text-3xl font-headline font-black tracking-tight md:text-5xl text-foreground">
                  Simple. Smart. Secure.
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl leading-relaxed mx-auto">
                  We've reimagined how you find and book home services using cutting-edge AI triage.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group border-none shadow-xl bg-background/50 hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-10 pb-10">
                  <div className="rounded-2xl bg-primary/10 w-14 h-14 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3">AI Problem Triage</h3>
                  <p className="text-muted-foreground leading-relaxed">Just tell us what's wrong in plain English. Our AI understands the context and matches you with the right specialist instantly.</p>
                </CardContent>
              </Card>
              <Card className="group border-none shadow-xl bg-background/50 hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-10 pb-10">
                  <div className="rounded-2xl bg-accent/10 w-14 h-14 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3">Verified Pros</h3>
                  <p className="text-muted-foreground leading-relaxed">All professionals on WorkNest undergo a rigorous background check and vetting process to ensure top-quality service.</p>
                </CardContent>
              </Card>
              <Card className="group border-none shadow-xl bg-background/50 hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-10 pb-10">
                  <div className="rounded-2xl bg-primary/10 w-14 h-14 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <Star className="h-7 w-7 fill-current" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3">Seamless Booking</h3>
                  <p className="text-muted-foreground leading-relaxed">Forget phone tag. View real-time availability, book with one tap, and manage everything through your dashboard.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="w-full py-20 md:py-32 bg-background/30">
          <div className="container px-4 md:px-6 mx-auto">
            <ReviewsSection />
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="w-full py-20 md:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <MessageSquare className="h-4 w-4" />
                  <span>Community Voice</span>
                </div>
                <h2 className="text-3xl font-headline font-black tracking-tight md:text-5xl text-foreground">
                  Your Feedback Matters
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed mx-auto">
                  Help us build the perfect home service platform. Tell us about your experience.
                </p>
              </div>
            </div>
            <div className="max-w-2xl mx-auto">
              <FeedbackForm />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-accent rounded-full blur-[120px] opacity-20"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h2 className="text-4xl font-headline font-black tracking-tight md:text-6xl max-w-2xl leading-[1.1]">
                Ready to get your <br />
                home back in shape?
              </h2>
              <p className="max-w-[600px] text-primary-foreground/80 md:text-xl font-body mb-4">
                Join our community of homeowners and professionals today.
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-secondary border-none shadow-2xl h-14 px-10 text-lg font-bold">
                <Link href="/dashboard/user">Start AI Triage <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-white border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link href="/">
              <WorkNestLogo />
            </Link>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <p className="text-sm text-muted-foreground">© 2025 WorkNest Inc. All rights reserved.</p>
              <nav className="flex gap-6">
                <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">
                  Terms
                </Link>
                <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">
                  Privacy
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
