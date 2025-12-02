import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft, Search, RefreshCw, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { issueTypeLabels } from "@/lib/validation";
import { ComplaintTable } from "@/components/ComplaintTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Complaint = Database["public"]["Tables"]["complaints"]["Row"];
type IssueStatus = Database["public"]["Enums"]["issue_status"];
type IssueType = Database["public"]["Enums"]["issue_type"];

const Admin = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchRoom, setSearchRoom] = useState("");
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "all">("all");
  const [filterType, setFilterType] = useState<IssueType | "all">("all");
  const { toast } = useToast();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchRoom) {
        query = query.ilike("room_number", `%${searchRoom}%`);
      }
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      if (filterType !== "all") {
        query = query.eq("issue_type", filterType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch complaints",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("complaints-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "complaints",
        },
        () => {
          fetchComplaints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchRoom, filterStatus, filterType]);

  const handleStatusChange = async (id: string, status: IssueStatus) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Complaint marked as ${status.replace("_", " ")}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

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
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track all electrical issue complaints
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Complaints</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-status-pending">{stats.pending}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-status-progress">{stats.inProgress}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold text-status-resolved">{stats.resolved}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search room..."
                value={searchRoom}
                onChange={(e) => setSearchRoom(e.target.value.toUpperCase())}
                className="w-full pl-9 sm:w-40"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as IssueStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as IssueType | "all")}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Issue Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(issueTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={fetchComplaints} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ComplaintTable
            complaints={complaints}
            onStatusChange={handleStatusChange}
            isUpdating={updating}
          />
        )}
      </main>
    </div>
  );
};

export default Admin;
