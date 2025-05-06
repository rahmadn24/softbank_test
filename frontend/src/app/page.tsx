"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CustomerList } from "@/components/CustomerList";
import { CustomerDetails } from "@/components/CustomerDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const router = useRouter();

  // Cek apakah user sudah login berdasarkan token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Jika tidak ada token, redirect ke halaman login
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token");

    // Redirect ke halaman login
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Superbank.svg" alt="Superbank Logo" className="h-8" />
    </div>
          <div className="flex items-center gap-4">
            {/* Search bar */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  Hello, Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <Card className="p-6">
              <CustomerList
                searchQuery={searchQuery}
                onSelectCustomer={(id) => setSelectedCustomerId(id)}
                selectedCustomerId={selectedCustomerId}
              />
            </Card>
          </div>
          <div className="col-span-7">
            <Card className="p-6">
              {selectedCustomerId ? (
                <CustomerDetails customerId={selectedCustomerId} />
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a customer to view details
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
