'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Contact } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AddEmployeePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center border-b bg-card px-4">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="ml-4 text-lg font-semibold">Add Employee Details</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-24">
        <Alert className="mb-8 border-accent/50 bg-accent/10">
          <AlertDescription className="text-primary">
            Now Add Multiple Staff using Desktop app -{' '}
            <a href="#" className="font-semibold text-primary underline">
              web.salarybox.in
            </a>
          </AlertDescription>
        </Alert>

        <form className="space-y-6">
          <div>
            <Label htmlFor="staff-name">Staff Name</Label>
            <Input id="staff-name" placeholder="Enter Name" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="phone-number">Phone Number</Label>
            <div className="mt-1 flex gap-2">
              <Select defaultValue="+91">
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                  {/* Add other country codes if needed */}
                </SelectContent>
              </Select>
              <Input
                id="phone-number"
                type="tel"
                placeholder="Enter Phone Number"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="login-otp">Login OTP</Label>
            <Input
              id="login-otp"
              defaultValue="628115"
              className="mt-1"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="permission">Permission</Label>
            <Select defaultValue="employee">
              <SelectTrigger id="permission" className="mt-1">
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center pt-2">
            <Button variant="ghost" className="text-accent hover:text-accent">
                <Contact className="mr-2 h-5 w-5" />
              Add From Contacts
            </Button>
          </div>
        </form>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
        <Button className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
          Add Employee
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </footer>
    </div>
  );
}
