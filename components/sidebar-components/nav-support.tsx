'use client';

import * as React from 'react';
import { type LucideIcon } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SupportModal } from '@/components/account-components/support-modal';
import { FeedbackModal } from '@/components/account-components/feedback-modal';

export function NavSupport({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [supportOpen, setSupportOpen] = React.useState(false);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton 
                onClick={() => {
                  if (item.title === 'Support') setSupportOpen(true);
                  if (item.title === 'Feedback') setFeedbackOpen(true);
                }}
                className="cursor-pointer" 
                size="sm"
              >
								<item.icon />
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
      
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
		</SidebarGroup>
	);
}
