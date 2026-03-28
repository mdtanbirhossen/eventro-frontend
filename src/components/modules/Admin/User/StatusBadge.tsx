import { Badge } from "@/components/ui/badge";
import { Role, UserStatus } from "@/types/enums";

export function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    ACTIVE: { label: "Active", variant: "default" },
    BLOCKED: { label: "Blocked", variant: "destructive" },
    DELETED: { label: "Deleted", variant: "outline" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant} className="text-xs">{label}</Badge>;
}
 
export  function RoleBadge({ role }: { role: Role }) {
  return role === Role.ADMIN ? (
    <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-medium hover:bg-amber-100">
      Admin
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-xs font-medium">
      User
    </Badge>
  );
}
 