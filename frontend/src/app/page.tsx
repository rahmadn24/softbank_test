'use client';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { CustomerList } from "@/components/CustomerList";
import { CustomerDetails } from "@/components/CustomerDetails";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Customer Dashboard</h1>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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