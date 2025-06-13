'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

type CoinsType = {
	value: string;
	label: string;
};

type AvailableCoinsType = {
	availableCoins: CoinsType[];
	selectedCoins: string[];
	onSelectCoins: (coins: string[]) => void;
	maxCoins: number;
};

const SelectCoins = ({
	availableCoins,
	selectedCoins,
	onSelectCoins,
	maxCoins = 3,
}: AvailableCoinsType) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="default"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between text-background"
				>
					{selectedCoins.length > 0
						? `${selectedCoins.length} coins selected`
						: 'Coins List...'}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0 bg-background">
				<Command>
					<CommandInput
						placeholder="Search framework..."
						className="h-9"
					/>
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{availableCoins.map((coin) => (
								<CommandItem
									key={coin.value}
									value={coin.value}
									className={
										selectedCoins.includes(coin.value)
											? 'bg-primary/15 line-through'
											: ''
									}
									onSelect={(currentValue) => {
										if (
											selectedCoins.includes(currentValue)
										) {
											onSelectCoins(
												selectedCoins.filter(
													(coin) =>
														coin !== currentValue
												)
											);
										} else if (
											selectedCoins.length < maxCoins
										) {
											onSelectCoins([
												...selectedCoins,
												currentValue,
											]);
										}
										setOpen(false);
									}}
								>
									{coin.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default SelectCoins;
