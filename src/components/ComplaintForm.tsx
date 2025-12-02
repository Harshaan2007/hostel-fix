import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { complaintSchema, ComplaintFormData, validateRoomNumber, issueTypeLabels } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function ComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [roomValidation, setRoomValidation] = useState<{ valid: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      roomNumber: "",
      description: "",
      studentName: "",
      studentEmail: "",
    },
  });

  const roomNumber = watch("roomNumber");

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setValue("roomNumber", value);
    if (value.length >= 3) {
      setRoomValidation(validateRoomNumber(value));
    } else {
      setRoomValidation(null);
    }
  };

  const onSubmit = async (data: ComplaintFormData) => {
    const roomCheck = validateRoomNumber(data.roomNumber);
    if (!roomCheck.valid) {
      toast({
        title: "Validation Error",
        description: roomCheck.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("complaints").insert({
        room_number: data.roomNumber.toUpperCase(),
        issue_type: data.issueType,
        description: data.description,
        student_name: data.studentName || null,
        student_email: data.studentEmail || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Complaint Submitted",
        description: "Your electrical issue has been reported successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewComplaint = () => {
    setSubmitted(false);
    setRoomValidation(null);
    reset();
  };

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-status-resolved-bg">
          <CheckCircle2 className="h-10 w-10 text-status-resolved" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-foreground">Complaint Submitted!</h2>
        <p className="mb-6 max-w-md text-muted-foreground">
          Your electrical issue has been reported. The maintenance staff will attend to it soon.
        </p>
        <Button onClick={handleNewComplaint} variant="outline">
          Report Another Issue
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-slide-up space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Room Number */}
        <div className="space-y-2">
          <Label htmlFor="roomNumber">
            Room Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="roomNumber"
              placeholder="e.g., A-101"
              className="uppercase"
              {...register("roomNumber")}
              onChange={handleRoomChange}
              maxLength={5}
            />
            {roomValidation && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {roomValidation.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-status-resolved" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            )}
          </div>
          {errors.roomNumber && (
            <p className="text-sm text-destructive">{errors.roomNumber.message}</p>
          )}
          {roomValidation && !roomValidation.valid && !errors.roomNumber && (
            <p className="text-sm text-destructive">{roomValidation.message}</p>
          )}
          <p className="text-xs text-muted-foreground">Format: Block-RoomNo (e.g., A-101, B-202)</p>
        </div>

        {/* Issue Type */}
        <div className="space-y-2">
          <Label htmlFor="issueType">
            Issue Type <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(value) => setValue("issueType", value as ComplaintFormData["issueType"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(issueTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.issueType && (
            <p className="text-sm text-destructive">{errors.issueType.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the electrical issue in detail..."
          rows={4}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Student Name */}
        <div className="space-y-2">
          <Label htmlFor="studentName">Your Name (Optional)</Label>
          <Input
            id="studentName"
            placeholder="e.g., John Doe"
            {...register("studentName")}
          />
          {errors.studentName && (
            <p className="text-sm text-destructive">{errors.studentName.message}</p>
          )}
        </div>

        {/* Student Email */}
        <div className="space-y-2">
          <Label htmlFor="studentEmail">Email (Optional)</Label>
          <Input
            id="studentEmail"
            type="email"
            placeholder="e.g., student@university.edu"
            {...register("studentEmail")}
          />
          {errors.studentEmail && (
            <p className="text-sm text-destructive">{errors.studentEmail.message}</p>
          )}
          <p className="text-xs text-muted-foreground">For status updates</p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Zap className="mr-2 h-4 w-4 animate-pulse" />
            Submitting...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Submit Complaint
          </>
        )}
      </Button>
    </form>
  );
}
