import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
	return (
		<div className="flex min-h-[80vh] w-full flex-col items-center justify-center space-y-4 bg-background text-foreground">
			<div className="relative flex items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-primary" />
				<div className="absolute h-10 w-10 animate-ping rounded-full bg-primary/20" />
			</div>
			<div className="flex flex-col items-center space-y-1">
				<p className="text-sm font-semibold tracking-wide text-foreground/80 uppercase">bitBrief</p>
				<p className="text-xs text-muted-foreground animate-pulse">Loading intelligence...</p>
			</div>
		</div>
	);
};

export default Loading;
