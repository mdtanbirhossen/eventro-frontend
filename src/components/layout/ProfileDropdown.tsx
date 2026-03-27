import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/types/user.types"
import Image from "next/image"

export function ProfileDropdown({ user, handleLogout }: { user: User, handleLogout: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="rounded-full  p-0.5 cursor-pointer "><Image src={user.image || '/user.png'} className="rounded-full object-cover" width={30} height={30} alt="" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 mr-1" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <div>
                            <div className="text-xs font-normal">My Account</div>
                            <div> Hi, {user.name}</div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem onClick={handleLogout} className="bg-red-500">
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
