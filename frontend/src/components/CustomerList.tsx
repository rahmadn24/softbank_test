'use client';

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CustomerListProps {
  searchQuery: string;
  onSelectCustomer: (id: string) => void;
  selectedCustomerId: string | null;
}

interface Customer {
  id: string;
  name?: string;
  email?: string;
}

export function CustomerList({
  searchQuery,
  onSelectCustomer,
  selectedCustomerId,
}: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
        if (!token) {
          console.log("No token found, please login.");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/customers?search=${searchQuery}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Kirim token di header Authorization
            },
          }
        );
        const data = await response.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className={cn(
              "flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-colors",
              selectedCustomerId === customer.id
                ? "bg-primary/10"
                : "hover:bg-muted"
            )}
            onClick={() => onSelectCustomer(customer.id)}
          >
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <span className="text-lg font-semibold">
                {customer.name ? customer.name.charAt(0) : "?"}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">
                {customer.email || "No email available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
