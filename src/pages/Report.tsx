import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { ComplaintForm } from "@/components/ComplaintForm";
import { Button } from "@/components/ui/button";

const Report = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">HostelFix</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Report Electrical Issue</h1>
            <p className="text-muted-foreground">
              Fill out the form below to submit your complaint. Required fields are marked with *
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <ComplaintForm />
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <h4 className="mb-2 font-medium text-foreground">Room Number Format</h4>
            <p>
              Enter your room number in the format <code className="rounded bg-background px-1 py-0.5 font-mono">Block-RoomNumber</code>.
              For example: <strong>A-101</strong> (Block A, Room 101), <strong>B-305</strong> (Block B, Room 305).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;
