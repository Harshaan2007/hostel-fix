import { Link } from "react-router-dom";
import { Zap, ClipboardList, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">HostelFix</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/report">
              <Button variant="ghost">Report Issue</Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline">Staff Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            Electrical Issue Reporting System
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Report Hostel Electrical Issues
            <span className="text-primary"> Instantly</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            No more writing complaints in the hostel office. Submit your electrical issues
            online and track their resolution status in real-time.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/report">
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="mr-2 h-4 w-4" />
                Report an Issue
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <ClipboardList className="mr-2 h-4 w-4" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="animate-slide-up rounded-lg border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Easy Reporting</h3>
            <p className="text-sm text-muted-foreground">
              Submit complaints in seconds with our simple form. No paperwork required.
            </p>
          </div>
          <div className="animate-slide-up rounded-lg border bg-card p-6 text-center" style={{ animationDelay: "100ms" }}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-status-progress-bg">
              <Clock className="h-6 w-6 text-status-progress" />
            </div>
            <h3 className="mb-2 font-semibold">Real-time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Track the status of your complaints from pending to resolved.
            </p>
          </div>
          <div className="animate-slide-up rounded-lg border bg-card p-6 text-center" style={{ animationDelay: "200ms" }}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-status-resolved-bg">
              <Shield className="h-6 w-6 text-status-resolved" />
            </div>
            <h3 className="mb-2 font-semibold">Staff Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Maintenance staff can manage and resolve issues efficiently.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>HostelFix - Electrical Issue Reporting System</p>
          <p className="mt-1">Powered by Lovable Cloud</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
