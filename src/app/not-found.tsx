import { Button } from "@/components/ui/button";
import { MoveLeft, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <h1 className="text-4xl font-bold mb-4 flex  items-center gap-2"><SearchX className="w-12 h-12 " /> - Page Not Found</h1>
            <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
            <Link href="/" className="">
                <Button size={"lg"} className="">
                    <MoveLeft />
                    Go Home
                </Button>
            </Link>
        </div>
    );
}