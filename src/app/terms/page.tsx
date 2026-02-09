import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <Button asChild variant="ghost" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Terms</h2>
          <p>
            By accessing the website at PayEase, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on PayEase's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Disclaimer</h2>
          <p>
            The materials on PayEase's website are provided on an 'as is' basis. PayEase makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </div>
         <div>
          <h2 className="text-xl font-semibold mb-2">4. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>
      </div>
    </div>
  );
}
