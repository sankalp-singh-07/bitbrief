'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitFeedback } from '@/app/actions/feedback.actions';
import { Loader2, Star, CheckCircle2 } from 'lucide-react';

export function FeedbackModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [liked, setLiked] = useState('');
  const [improved, setImproved] = useState('');
  const [bugs, setBugs] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !liked || !improved) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({ rating, liked, improved, bugs });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setRating(0);
        setLiked('');
        setImproved('');
        setBugs('');
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
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Share Feedback</DialogTitle>
          <DialogDescription>
            Help us improve BitBrief. We read every single review.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
            <h3 className="text-xl font-medium">Thank you!</h3>
            <p className="text-muted-foreground text-sm">Your feedback drives our roadmap.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <span className="text-sm font-medium">How would you rate your experience?</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground stroke-1'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What do you like most?</label>
                <Textarea placeholder="Share your favorite features..." value={liked} onChange={(e: any) => setLiked(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">What could be improved?</label>
                <Textarea placeholder="Constructive criticism is welcome..." value={improved} onChange={(e: any) => setImproved(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Any bugs or issues? (Optional)</label>
                <Textarea placeholder="Did something break?" value={bugs} onChange={(e: any) => setBugs(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || rating === 0 || !liked || !improved}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
