'use client';

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerDetailsProps {
  customerId: string;
}

interface CustomerData {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  bank_accounts: Array<{
    id: string;
    account_name: string;
    account_number: string;
    type: string;
    balance: number;
  }>;
  pockets: Array<{
    id: string;
    name: string;
    description: string;
    balance: number;
  }>;
  term_deposits: Array<{
    id: string;
    amount: number;
    interest_rate: number;
    start_date: string;
    end_date: string;
    status: string;
  }>;
}

export function CustomerDetails({ customerId }: CustomerDetailsProps) {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/customers/${customerId}`);
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!customerData) {
    return <div>Customer not found</div>;
  }

  const { customer, bank_accounts, pockets, term_deposits } = customerData;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{customer.name}</h2>
        <p className="text-muted-foreground">{customer.email}</p>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="pockets">Pockets</TabsTrigger>
          <TabsTrigger value="deposits">Term Deposits</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Phone</h4>
              <p>{customer.phone || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Address</h4>
              <p>{customer.address || 'N/A'}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <div className="space-y-4">
            {bank_accounts.map((account) => (
              <div key={account.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{account.account_name}</h4>
                    <p className="text-sm text-muted-foreground">{account.account_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${account.balance.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{account.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pockets">
          <div className="space-y-4">
            {pockets.map((pocket) => (
              <div key={pocket.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{pocket.name}</h4>
                    <p className="text-sm text-muted-foreground">{pocket.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${pocket.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deposits">
          <div className="space-y-4">
            {term_deposits.map((deposit) => (
              <div key={deposit.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">${deposit.amount.toFixed(2)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(deposit.start_date).toLocaleDateString()} - 
                      {new Date(deposit.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{deposit.interest_rate}% p.a.</p>
                    <p className="text-sm text-muted-foreground">
                      {deposit.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}