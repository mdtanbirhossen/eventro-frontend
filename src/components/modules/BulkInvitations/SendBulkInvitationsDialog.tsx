"use client";

import { useState, useMemo } from "react";
import {
    useSendBulkInvitations,
    useSearchUsers,
    useEventInvitations,
} from "@/hooks/sendBulkInvitations.hooks";
import { IMyEvent } from "@/types/userDashboard.type";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    Search,
    Loader2,
    X,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

interface SendBulkInvitationsDialogProps {
    event: IMyEvent | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SendBulkInvitationsDialog({
    event,
    isOpen,
    onOpenChange,
}: SendBulkInvitationsDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [step, setStep] = useState<"search" | "confirm" | "result">("search");
    const [resultData, setResultData] = useState<any>(null);

    // Hooks
    const { data: searchResults = [], isLoading: isSearching } = useSearchUsers({
        search: searchQuery,
        limit: 20,
    });

    const { data: alreadyInvited = [] } = useEventInvitations(event?.id || "");
    const { mutateAsync: sendInvitations, isPending } =
        useSendBulkInvitations(event?.id || "");

    // Filter out already invited users
    const availableUsers = useMemo(
        () =>
            searchResults.filter((user) => !alreadyInvited.includes(user.id)),
        [searchResults, alreadyInvited]
    );

    const selectedUsers = useMemo(
        () =>
            availableUsers.filter((user) => selectedUserIds.includes(user.id)),
        [availableUsers, selectedUserIds]
    );

    const handleUserToggle = (userId: string) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = (checked: boolean | "indeterminate") => {
        if (checked) {
            setSelectedUserIds(availableUsers.map((u) => u.id));
        } else {
            setSelectedUserIds([]);
        }
    };

    const handleSendInvitations = async () => {
        if (selectedUserIds.length === 0 || !event) {
            return;
        }

        try {
            const result = await sendInvitations({
                invitedUserIds: selectedUserIds,
                message: message.trim() || undefined,
            });

            setResultData(result);
            setStep("result");
        } catch (error) {
            // Error is handled by the hook
            console.error(error);
        }
    };

    const handleClose = () => {
        if (step === "result") {
            // Reset state when closing from result screen
            setStep("search");
            setSelectedUserIds([]);
            setMessage("");
            setSearchQuery("");
            setResultData(null);
        }
        onOpenChange(false);
    };

    if (!event) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                {step === "search" && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Send Invitations
                            </DialogTitle>
                            <DialogDescription>
                                Select users to invite to &quot;{event.title}&quot;
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search users by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* User List */}
                            <div className="border rounded-lg bg-muted/30">
                                <ScrollArea className="h-[300px]">
                                    {isSearching ? (
                                        <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Searching users...
                                        </div>
                                    ) : searchQuery && availableUsers.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4">
                                            {alreadyInvited.length > 0 &&
                                                searchResults.length > 0 &&
                                                searchResults.every((u) =>
                                                    alreadyInvited.includes(u.id)
                                                )
                                                ? "All matching users have already been invited"
                                                : "No users found"}
                                        </div>
                                    ) : searchQuery && availableUsers.length > 0 ? (
                                        <div className="divide-y p-2">
                                            {/* Select All Header */}
                                            <div className="flex items-center gap-3 p-3 hover:bg-muted/50">
                                                <Checkbox
                                                    checked={
                                                        availableUsers.length === 0
                                                            ? false
                                                            : selectedUserIds.length === availableUsers.length
                                                                ? true
                                                                : selectedUserIds.length > 0
                                                                    ? "indeterminate"
                                                                    : false
                                                    }
                                                    onCheckedChange={handleSelectAll}
                                                />
                                                <div>
                                                    <p className="text-sm font-medium">Select All</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedUserIds.length} of {availableUsers.length}{" "}
                                                        selected
                                                    </p>
                                                </div>
                                            </div>

                                            {/* User Items */}
                                            {availableUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                                                    onClick={() => handleUserToggle(user.id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedUserIds.includes(user.id)}
                                                        onCheckedChange={() => handleUserToggle(user.id)}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    {user.image && (
                                                        <img
                                                            src={user.image}
                                                            alt={user.name}
                                                            className="h-8 w-8 rounded-full object-cover shrink-0"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            Start typing to search for users
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Message Input */}
                            {selectedUserIds.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Message (Optional)
                                    </label>
                                    <Textarea
                                        placeholder="Add a personal message to your invitations..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="min-h-[80px] resize-none"
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {message.length}/500
                                    </p>
                                </div>
                            )}

                            {/* Selected Users Summary */}
                            {selectedUserIds.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Selected Users ({selectedUserIds.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((user) => (
                                            <Badge
                                                key={user.id}
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                {user.name}
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => handleUserToggle(user.id)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setStep("confirm")}
                                disabled={selectedUserIds.length === 0}
                            >
                                Next
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === "confirm" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Confirm Invitations</DialogTitle>
                            <DialogDescription>
                                Review and confirm before sending
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Event Info */}
                            <div className="rounded-lg bg-muted p-4">
                                <p className="text-sm font-medium mb-1">Event</p>
                                <p className="text-sm text-muted-foreground">{event.title}</p>
                            </div>

                            {/* Recipients */}
                            <div className="rounded-lg bg-muted p-4">
                                <p className="text-sm font-medium mb-2">
                                    Recipients ({selectedUserIds.length})
                                </p>
                                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                                    {selectedUsers.map((user) => (
                                        <p key={user.id} className="text-sm text-muted-foreground">
                                            {user.name} ({user.email})
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            {message && (
                                <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm font-medium mb-2">Message</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {message}
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setStep("search")}
                                disabled={isPending}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSendInvitations}
                                disabled={isPending}
                                className="gap-2"
                            >
                                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                Send {selectedUserIds.length} Invitation
                                {selectedUserIds.length !== 1 ? "s" : ""}
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === "result" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Invitations Sent</DialogTitle>
                            <DialogDescription>
                                Summary of invitation delivery
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Summary */}
                            {resultData?.summary && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="rounded-lg bg-muted p-4 text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {resultData.summary.successCount}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Successful
                                        </p>
                                    </div>
                                    {resultData.summary.failedCount > 0 && (
                                        <div className="rounded-lg bg-muted p-4 text-center">
                                            <p className="text-2xl font-bold text-red-600">
                                                {resultData.summary.failedCount}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Failed
                                            </p>
                                        </div>
                                    )}
                                    <div className="rounded-lg bg-muted p-4 text-center">
                                        <p className="text-2xl font-bold">
                                            {resultData.summary.total}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Total</p>
                                    </div>
                                </div>
                            )}

                            {/* Successful Invitations */}
                            {resultData?.successful && resultData.successful.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <p className="text-sm font-medium">
                                            Successfully Sent ({resultData.successful.length})
                                        </p>
                                    </div>
                                    <div className="max-h-[150px] overflow-y-auto space-y-1">
                                        {resultData.successful.map(
                                            (item: { userId: string; invitationId: string }) => (
                                                <p
                                                    key={item.userId}
                                                    className="text-sm text-muted-foreground"
                                                >
                                                    ✓ User ID: {item.userId}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Failed Invitations */}
                            {resultData?.failed && resultData.failed.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <p className="text-sm font-medium text-red-600">
                                            Failed ({resultData.failed.length})
                                        </p>
                                    </div>
                                    <div className="max-h-[150px] overflow-y-auto space-y-1">
                                        {resultData.failed.map(
                                            (item: { userId: string; reason: string }) => (
                                                <div key={item.userId} className="text-sm">
                                                    <p className="text-muted-foreground">
                                                        ✗ User ID: {item.userId}
                                                    </p>
                                                    <p className="text-xs text-red-600 ml-4">
                                                        {item.reason}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button onClick={handleClose} className="w-full">
                                Done
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}