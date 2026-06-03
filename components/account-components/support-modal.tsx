'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createSupportTicket } from '@/app/actions/support.actions';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function SupportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    setIsSubmitting(true);
    try {
      await createSupportTicket(subject, description);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSubject('');
        setDescription('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Support Center</DialogTitle>
          <DialogDescription>
            Need help configuring alerts or upgrading? Reach out to our team below.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
            <h3 className="text-xl font-medium">Ticket Created</h3>
            <p className="text-muted-foreground text-sm">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input 
                placeholder="E.g., Alerts not triggering" 
                value={subject} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Please describe your issue in detail..." 
                rows={4} 
                value={description} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || !subject || !description}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
