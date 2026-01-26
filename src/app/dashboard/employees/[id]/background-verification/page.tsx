'use client';

import { useState, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { ArrowLeft, Loader2, ShieldCheck, Camera, CheckCircle, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

type IdProofKey = 'aadhaarNumber' | 'panNumber' | 'drivingLicenseNumber' | 'voterIdNumber' | 'uanNumber';

const idProofs: { key: IdProofKey; label: string }[] = [
    { key: 'aadhaarNumber', label: 'Aadhaar' },
    { key: 'panNumber', label: 'PAN' },
    { key: 'drivingLicenseNumber', label: 'Driving License' },
    { key: 'voterIdNumber', label: 'Voter ID' },
    { key: 'uanNumber', label: 'UAN' },
];

export default function BackgroundVerificationPage() {
    const router = useRouter();
    const params = useParams();
    const employeeId = params.id as string;
    const firestore = useFirestore();
    const { toast } = useToast();

    const [isSaving, setIsSaving] = useState(false);

    // Dialog states
    const [isIdProofDialogOpen, setIsIdProofDialogOpen] = useState(false);
    const [isFaceVerifyDialogOpen, setIsFaceVerifyDialogOpen] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [isPastEmploymentDialogOpen, setIsPastEmploymentDialogOpen] = useState(false);

    // ID Proof state
    const [currentIdProof, setCurrentIdProof] = useState<{ key: IdProofKey; label: string } | null>(null);
    const [idProofValue, setIdProofValue] = useState('');

    // Face Verify state
    const [faceImage, setFaceImage] = useState<File | null>(null);
    const [isVerifyingFace, setIsVerifyingFace] = useState(false);
    const [faceVerified, setFaceVerified] = useState(false);

    // Address state
    const [currentAddress, setCurrentAddress] = useState('');
    const [permanentAddress, setPermanentAddress] = useState('');

    // Past Employment state
    const [companyName, setCompanyName] = useState('');
    const [designation, setDesignation] = useState('');
    const [joiningDate, setJoiningDate] = useState<Date | undefined>();
    const [leavingDate, setLeavingDate] = useState<Date | undefined>();
    const [currency, setCurrency] = useState('INR');
    const [salary, setSalary] = useState('');
    const [companyGst, setCompanyGst] = useState('');

    const employeeRef = useMemoFirebase(
        () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
        [firestore, employeeId]
    ) as DocumentReference<Employee> | null;

    const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

    // --- Handlers for ID Proofs ---
    const handleIdProofClick = (proof: { key: IdProofKey; label: string }) => {
        setCurrentIdProof(proof);
        const value = employee?.[proof.key] as string | undefined;
        setIdProofValue(value || '');
        setIsIdProofDialogOpen(true);
    };

    const handleSaveIdProof = () => {
        if (!employeeRef || !currentIdProof) return;
        setIsSaving(true);
        updateDocumentNonBlocking(employeeRef, { [currentIdProof.key]: idProofValue });
        toast({
            title: `${currentIdProof.label} Saved!`,
            description: `The ${currentIdProof.label} number has been saved.`,
        });
        setTimeout(() => {
            setIsSaving(false);
            setIsIdProofDialogOpen(false);
        }, 500);
    };

    // --- Handlers for Face Verification ---
    const handleFaceVerifyClick = () => setIsFaceVerifyDialogOpen(true);

    const handleFaceImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFaceImage(e.target.files[0]);
        }
    };

    const handleStartFaceVerification = () => {
        setIsVerifyingFace(true);
        setTimeout(() => {
            setIsVerifyingFace(false);
            setFaceVerified(true);
            toast({
                title: 'Face Verified!',
                description: "The employee's face has been successfully verified.",
            });
        }, 1500);
    };

    // --- Handlers for Address ---
    const handleAddressClick = () => {
        setCurrentAddress(employee?.currentAddress || '');
        setPermanentAddress(employee?.permanentAddress || '');
        setIsAddressDialogOpen(true);
    };

    const handleSaveAddress = () => {
        if (!employeeRef) return;
        setIsSaving(true);
        updateDocumentNonBlocking(employeeRef, {
            currentAddress,
            permanentAddress,
        });
        toast({
            title: 'Address Saved!',
            description: 'The addresses have been updated.',
        });
        setTimeout(() => {
            setIsSaving(false);
            setIsAddressDialogOpen(false);
        }, 500);
    };

    // --- Handlers for Past Employment ---
    const handlePastEmploymentClick = () => {
        if (employee?.pastEmployment && typeof employee.pastEmployment !== 'string') {
            setCompanyName(employee.pastEmployment.companyName || '');
            setDesignation(employee.pastEmployment.designation || '');
            setJoiningDate(employee.pastEmployment.joiningDate && isValid(parseISO(employee.pastEmployment.joiningDate)) ? parseISO(employee.pastEmployment.joiningDate) : undefined);
            setLeavingDate(employee.pastEmployment.leavingDate && isValid(parseISO(employee.pastEmployment.leavingDate)) ? parseISO(employee.pastEmployment.leavingDate) : undefined);
            setCurrency(employee.pastEmployment.currency || 'INR');
            setSalary(employee.pastEmployment.salary?.toString() || '');
            setCompanyGst(employee.pastEmployment.companyGst || '');
        } else {
            setCompanyName('');
            setDesignation('');
            setJoiningDate(undefined);
            setLeavingDate(undefined);
            setCurrency('INR');
            setSalary('');
            setCompanyGst('');
        }
        setIsPastEmploymentDialogOpen(true);
    };

    const handleSavePastEmployment = () => {
        if (!employeeRef) return;
        setIsSaving(true);
        const updatedData = {
            pastEmployment: {
                companyName,
                designation,
                joiningDate: joiningDate ? format(joiningDate, 'yyyy-MM-dd') : '',
                leavingDate: leavingDate ? format(leavingDate, 'yyyy-MM-dd') : '',
                currency,
                salary: salary ? Number(salary) : 0,
                companyGst,
            }
        };
        updateDocumentNonBlocking(employeeRef, updatedData);
        toast({
            title: 'Past Employment Saved!',
            description: `The past employment details have been saved.`,
        });
        setTimeout(() => {
            setIsSaving(false);
            setIsPastEmploymentDialogOpen(false);
        }, 500);
    };

    const isPastEmploymentFormValid = companyName.trim() && joiningDate && leavingDate;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    // --- JSX ---
    return (
        <>
            <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-950">
                <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
                    <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="ml-4 text-lg font-semibold">
                        Background Verification: {employee?.name || ''}
                    </h1>
                </header>

                <main className="flex-1 overflow-y-auto p-4">
                    <Card className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className='flex items-center justify-between gap-3 p-4'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-blue-600 text-white p-2 rounded-lg'>
                                    <ShieldCheck className='h-6 w-6' />
                                </div>
                                <div>
                                    <p className='font-semibold text-blue-800 dark:text-blue-200'>Verify staff to prevent fraud for ₹ 350 only!</p>
                                </div>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Start Verification</Button>
                        </CardContent>
                    </Card>
                    
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-base">ID Proofs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 p-4 pt-0">
                            {idProofs.map((proof) => {
                                const value = employee?.[proof.key] as string | undefined;
                                return (
                                    <div key={proof.key} className="flex items-center justify-between border-b pb-3 pt-2 last:border-b-0">
                                        <div>
                                            <p className="font-medium">{proof.label}</p>
                                            {value && <p className="text-sm text-muted-foreground">{value}</p>}
                                        </div>
                                        <Button variant={value ? 'outline' : 'default'} size="sm" onClick={() => handleIdProofClick(proof)}>
                                            {value ? 'Edit' : <><Plus className="md:mr-2 h-4 w-4" /><span className="hidden md:inline">Add</span></>}
                                        </Button>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="mb-4">
                        <CardContent className="flex items-center justify-between p-4">
                            <p className="font-medium">Face</p>
                            <Button variant="default" onClick={handleFaceVerifyClick}>Verify</Button>
                        </CardContent>
                    </Card>

                    <Card className="mb-4">
                        <CardContent className="p-4">
                           {employee?.currentAddress || employee?.permanentAddress ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">Address</p>
                                        <Button variant="outline" size="sm" onClick={handleAddressClick}>Edit</Button>
                                    </div>
                                    {employee.currentAddress && <p className="text-sm text-muted-foreground mt-2 truncate max-w-xs">{employee.currentAddress}</p>}
                                </>
                           ) : (
                               <div className="flex items-center justify-between">
                                    <p>Address</p>
                                    <Button size="sm" onClick={handleAddressClick}><Plus className="md:mr-2 h-4 w-4" /><span className="hidden md:inline">Add</span></Button>
                                </div>
                           )}
                        </CardContent>
                    </Card>

                    <Card className="mb-4">
                        <CardContent className="p-4">
                           {employee?.pastEmployment ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">Past Employment</p>
                                        <Button variant="outline" size="sm" onClick={handlePastEmploymentClick}>Edit</Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 truncate max-w-xs">
                                        {typeof employee.pastEmployment === 'string' ? employee.pastEmployment : employee.pastEmployment.companyName}
                                    </p>
                                </>
                           ) : (
                               <div className="flex items-center justify-between">
                                    <p>Past Employment</p>
                                    <Button size="sm" onClick={handlePastEmploymentClick}><Plus className="md:mr-2 h-4 w-4" /><span className="hidden md:inline">Add</span></Button>
                                </div>
                           )}
                        </CardContent>
                    </Card>

                </main>
            </div>
            
            {/* ID Proof Dialog */}
            <Dialog open={isIdProofDialogOpen} onOpenChange={setIsIdProofDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add {currentIdProof?.label}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="id-proof-value">{currentIdProof?.label} Number</Label>
                        <Input id="id-proof-value" value={idProofValue} onChange={(e) => setIdProofValue(e.target.value)} className="mt-1" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSaveIdProof} disabled={isSaving || !idProofValue.trim()}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Face Verify Dialog */}
            <Dialog open={isFaceVerifyDialogOpen} onOpenChange={setIsFaceVerifyDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Face Verification</DialogTitle>
                        <DialogDescription>Upload a clear photo of the employee for verification.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {faceVerified ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-lg">
                                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                                <h3 className="text-lg font-semibold">Verification Complete</h3>
                                <p className="text-muted-foreground text-sm">Face has been successfully verified.</p>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center w-full">
                                <Label htmlFor="face-picture" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                        <Camera className="w-10 h-10 mb-3 text-gray-400" />
                                        {faceImage ? (
                                            <p className="font-semibold text-gray-600 dark:text-gray-300">{faceImage.name}</p>
                                        ) : (
                                            <>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 800x400px)</p>
                                            </>
                                        )}
                                    </div>
                                    <Input id="face-picture" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFaceImageChange} />
                                </Label>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {faceVerified ? (
                            <DialogClose asChild><Button type="button">Done</Button></DialogClose>
                        ) : (
                             <>
                                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                <Button onClick={handleStartFaceVerification} disabled={!faceImage || isVerifyingFace}>
                                    {isVerifyingFace && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isVerifyingFace ? 'Verifying...' : 'Start Verification'}
                                </Button>
                             </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Address Dialog */}
            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label htmlFor="current-address">Current Address</Label>
                            <Textarea id="current-address" value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} className="mt-1" placeholder="Enter current address" />
                        </div>
                        <div>
                            <Label htmlFor="permanent-address">Permanent Address</Label>
                            <Textarea id="permanent-address" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} className="mt-1" placeholder="Enter permanent address" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSaveAddress} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Past Employment Dialog */}
            <Dialog open={isPastEmploymentDialogOpen} onOpenChange={setIsPastEmploymentDialogOpen}>
              <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                      <DialogTitle>Past Employment Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                      <div className="space-y-2 px-1">
                          <Label htmlFor="company-name">Company Name <span className="text-red-500">*</span></Label>
                          <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                      </div>
                      <div className="space-y-2 px-1">
                          <Label htmlFor="designation">Designation</Label>
                          <Input id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                      </div>
                       <div className="space-y-2 px-1">
                            <Label htmlFor="joining-date">Joining Date <span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-between text-left font-normal", !joiningDate && "text-muted-foreground")}
                                >
                                    {joiningDate ? format(joiningDate, "dd/MM/yyyy") : <span>Select date</span>}
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={joiningDate} onSelect={setJoiningDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2 px-1">
                            <Label htmlFor="leaving-date">Leaving Date <span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-between text-left font-normal", !leavingDate && "text-muted-foreground")}
                                >
                                    {leavingDate ? format(leavingDate, "dd/MM/yyyy") : <span>Select date</span>}
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={leavingDate} onSelect={setLeavingDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4 px-1">
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select onValueChange={setCurrency} value={currency}>
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input id="salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2 px-1">
                          <Label htmlFor="company-gst">Company GST</Label>
                          <Input id="company-gst" value={companyGst} onChange={(e) => setCompanyGst(e.target.value)} />
                      </div>
                  </div>
                  <DialogFooter>
                      <DialogClose asChild>
                          <Button type="button" variant="outline">
                              Cancel
                          </Button>
                      </DialogClose>
                      <Button onClick={handleSavePastEmployment} disabled={isSaving || !isPastEmploymentFormValid} className="bg-accent text-accent-foreground hover:bg-accent/90">
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSaving ? 'Saving...' : 'Add'}
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>

        </>
    );
}
