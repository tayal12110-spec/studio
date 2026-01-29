'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Calendar as CalendarIcon,
  BookUser,
} from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import {
  useDoc,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

export default function PersonalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } =
    useDoc<Employee>(employeeRef);

  const [staffName, setStaffName] = useState('');
  const [mobileCountryCode, setMobileCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [gender, setGender] = useState<Employee['gender']>();
  const [maritalStatus, setMaritalStatus] = useState<Employee['maritalStatus']>();
  const [bloodGroup, setBloodGroup] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactMobileCountryCode, setEmergencyContactMobileCountryCode] = useState('+91');
  const [emergencyContactMobile, setEmergencyContactMobile] = useState('');
  const [emergencyContactAddress, setEmergencyContactAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setStaffName(employee.name);

      const phone = employee.phoneNumber || '';
      const phoneParts = phone.split(' ');
      if (phoneParts.length > 1) {
        setMobileCountryCode(phoneParts[0]);
        setMobileNumber(phoneParts.slice(1).join(' '));
      } else {
        setMobileNumber(phone);
      }

      setPersonalEmail(employee.personalEmail || '');
      setDateOfBirth(employee.dateOfBirth && isValid(parseISO(employee.dateOfBirth)) ? parseISO(employee.dateOfBirth) : undefined);
      setGender(employee.gender);
      setMaritalStatus(employee.maritalStatus);
      setBloodGroup(employee.bloodGroup || '');
      setGuardianName(employee.guardianName || '');
      setEmergencyContactName(employee.emergencyContactName || '');
      setEmergencyContactRelationship(employee.emergencyContactRelationship || '');
      
      const emergencyMobile = employee.emergencyContactMobile || '';
      const emergencyMobileParts = emergencyMobile.split(' ');
      if (emergencyMobileParts.length > 1) {
        setEmergencyContactMobileCountryCode(emergencyMobileParts[0]);
        setEmergencyContactMobile(emergencyMobileParts.slice(1).join(' '));
      } else {
        setEmergencyContactMobile(emergencyMobile);
      }
      
      setEmergencyContactAddress(employee.emergencyContactAddress || '');
    }
  }, [employee]);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeRef) {
      setIsSaving(true);
      const updatedData: Partial<Employee> = {
        name: staffName,
        phoneNumber: `${mobileCountryCode} ${mobileNumber}`.trim(),
        personalEmail,
        dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : undefined,
        gender,
        maritalStatus,
        bloodGroup,
        guardianName,
        emergencyContactName,
        emergencyContactRelationship,
        emergencyContactMobile: `${emergencyContactMobileCountryCode} ${emergencyContactMobile}`.trim(),
        emergencyContactAddress,
      };

      const finalData = Object.fromEntries(Object.entries(updatedData).filter(([_, v]) => v !== undefined));

      updateDocumentNonBlocking(employeeRef, finalData);

      toast({
        title: 'Details Saved!',
        description: `${staffName}'s personal details have been updated.`,
      });

      setTimeout(() => {
        setIsSaving(false);
        router.push(`/dashboard/employees/${employeeId}`);
      }, 500);
    }
  };

  const isFormValid = staffName.trim() && mobileNumber.trim();
  
  if (isLoadingEmployee) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.push(`/dashboard/employees/${employeeId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Edit Personal Details</h1>
        </header>

        <form onSubmit={handleSaveDetails} className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="staff-name">Staff Name</Label>
                <Input id="staff-name" placeholder="rinku" className="mt-1" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <div className='flex items-center mt-1'>
                  <Select value={mobileCountryCode} onValueChange={setMobileCountryCode}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className='relative flex-1'>
                    <Input id="mobile-number" type="tel" placeholder="9811021904" className="pl-4" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
                    <BookUser className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="personal-email">Personal Email ID</Label>
                <Input id="personal-email" type="email" placeholder="eg. personal_email@gmail.com" className="mt-1" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="dob">Date Of Birth</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-between text-left font-normal mt-1",
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : <span>DD/MM/YYYY</span>}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
                    </PopoverContent>
                  </Popover>
              </div>

               <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value: any) => setGender(value)} value={gender}>
                  <SelectTrigger id="gender" className="mt-1">
                    <SelectValue placeholder="eg. Male" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="marital-status">Marital Status</Label>
                <Select onValueChange={(value: any) => setMaritalStatus(value)} value={maritalStatus}>
                  <SelectTrigger id="marital-status" className="mt-1">
                    <SelectValue placeholder="eg. Unmarried" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unmarried">Unmarried</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="blood-group">Blood Group</Label>
                <Input id="blood-group" placeholder="eg. O+" className="mt-1" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
              </div>
              
              <div>
                <Label htmlFor="guardian-name">Guardian's Name</Label>
                <Input id="guardian-name" placeholder="eg. Name" className="mt-1" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="emergency-contact-name">Emergency Contact Name</Label>
                <Input id="emergency-contact-name" placeholder="Contact Name" className="mt-1" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="emergency-contact-relationship">Emergency Contact Relationship</Label>
                <Input id="emergency-contact-relationship" placeholder="eg. Father" className="mt-1" value={emergencyContactRelationship} onChange={(e) => setEmergencyContactRelationship(e.target.value)} />
              </div>
              
              <div>
                <Label htmlFor="emergency-contact-mobile">Emergency Contact Mobile</Label>
                <div className='flex items-center mt-1'>
                  <Select value={emergencyContactMobileCountryCode} onValueChange={setEmergencyContactMobileCountryCode}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="emergency-contact-mobile" type="tel" placeholder="1234567890" className="flex-1" value={emergencyContactMobile} onChange={(e) => setEmergencyContactMobile(e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="emergency-contact-address">Emergency Contact Address</Label>
                <Input id="emergency-contact-address" placeholder="eg. XYZ Society, sector 101, Gurgaon" className="mt-1" value={emergencyContactAddress} onChange={(e) => setEmergencyContactAddress(e.target.value)} />
              </div>

            </div>
          </main>

          <footer className="shrink-0 border-t bg-card p-4">
            <Button
              type="submit"
              className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={!isFormValid || isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Details'}
            </Button>
          </footer>
        </form>
      </div>
    </>
  );
}
