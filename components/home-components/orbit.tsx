import { OrbitingCircles } from '@/components/magicui/orbiting-circles';
import { TokenIcon } from '@web3icons/react';

export function OrbitingCirclesDemo() {
	return (
		<div className="relative flex h-[350px] sm:h-[500px] w-full flex-col items-center justify-center overflow-hidden">
			<OrbitingCircles iconSize={20} radius={30}>
				<div className="block sm:hidden">
					<TokenIcon
						symbol="iota"
						variant="mono"
						size={17}
						color="#0077B6"
					/>
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="eth" variant="branded" size={20} />
				</div>

				<div className="block sm:hidden">
					<TokenIcon symbol="btc" variant="branded" size={17} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="btc" variant="branded" size={20} />
				</div>

				<div className="block sm:hidden">
					<TokenIcon symbol="matic" variant="branded" size={17} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon
						symbol="mnt"
						variant="mono"
						size={20}
						color="#0077B6"
					/>
				</div>
			</OrbitingCircles>

			<OrbitingCircles iconSize={40} radius={80} reverse>
				<div className="block sm:hidden">
					<TokenIcon symbol="ada" variant="branded" size={35} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="ada" variant="branded" size={40} />
				</div>

				<div className="block sm:hidden">
					<TokenIcon
						symbol="xrp"
						variant="mono"
						size={35}
						color="#0077B6"
					/>
				</div>
				<div className="hidden sm:block">
					<TokenIcon
						symbol="xrp"
						variant="mono"
						size={40}
						color="#0077B6"
					/>
				</div>

				<div className="block sm:hidden">
					<TokenIcon symbol="luna" variant="branded" size={35} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="kas" variant="branded" size={40} />
				</div>

				<div className="block sm:hidden">
					<TokenIcon symbol="ltc" variant="branded" size={35} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="ltc" variant="branded" size={40} />
				</div>
			</OrbitingCircles>

			<OrbitingCircles iconSize={55} radius={140}>
				<div className="block sm:hidden">
					<TokenIcon symbol="dot" variant="branded" size={52} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="dot" variant="branded" size={55} />
				</div>

				<div className="block sm:hidden">
					<TokenIcon symbol="uni" variant="branded" size={52} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="uni" variant="branded" size={55} />
				</div>

				<div className="block sm:hidden">
					<TokenIcon symbol="usdt" variant="branded" size={52} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="usdt" variant="branded" size={55} />
				</div>

				<div className="block sm:hidden">
					<TokenIcon symbol="shib" variant="branded" size={52} />
				</div>
				<div className="hidden sm:block">
					<TokenIcon symbol="shib" variant="branded" size={55} />
				</div>
			</OrbitingCircles>

			<div className="hidden sm:flex absolute inset-0 items-center justify-center">
				<OrbitingCircles iconSize={70} radius={200} reverse>
					<TokenIcon symbol="etc" variant="branded" size={70} />
					<TokenIcon symbol="bch" variant="branded" size={70} />
					<TokenIcon symbol="avax" variant="branded" size={70} />
					<TokenIcon symbol="fil" variant="branded" size={70} />
					<TokenIcon symbol="atom" variant="branded" size={70} />
				</OrbitingCircles>
			</div>
		</div>
	);
}
