import { z } from "zod";

// Room number validation (format: A-101, B-202, etc.)
const roomNumberRegex = /^[A-Z]-[0-9]{3}$/;

export const complaintSchema = z.object({
  roomNumber: z
    .string()
    .trim()
    .min(1, "Room number is required")
    .regex(roomNumberRegex, "Room format must be like A-101, B-202"),
  issueType: z.enum(["socket", "light", "fan", "ac", "wiring", "switch", "other"], {
    required_error: "Please select an issue type",
  }),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  studentName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  studentEmail: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;

// Validate room number format (simulating C validation)
export function validateRoomNumber(room: string): { valid: boolean; message: string } {
  const trimmed = room.trim().toUpperCase();
  
  if (!trimmed) {
    return { valid: false, message: "Room number cannot be empty" };
  }
  
  if (trimmed.length !== 5) {
    return { valid: false, message: "Room number must be 5 characters (e.g., A-101)" };
  }
  
  const blockLetter = trimmed[0];
  if (blockLetter < "A" || blockLetter > "Z") {
    return { valid: false, message: "First character must be a letter (A-Z)" };
  }
  
  if (trimmed[1] !== "-") {
    return { valid: false, message: "Second character must be a hyphen (-)" };
  }
  
  const roomNum = trimmed.slice(2);
  if (!/^\d{3}$/.test(roomNum)) {
    return { valid: false, message: "Room number must be 3 digits (001-999)" };
  }
  
  const floor = parseInt(roomNum[0]);
  if (floor < 1 || floor > 9) {
    return { valid: false, message: "Floor number must be between 1-9" };
  }
  
  return { valid: true, message: "Valid room number" };
}

export const issueTypeLabels: Record<string, string> = {
  socket: "Power Socket",
  light: "Lighting",
  fan: "Ceiling Fan",
  ac: "Air Conditioning",
  wiring: "Electrical Wiring",
  switch: "Switch/Board",
  other: "Other Issue",
};
