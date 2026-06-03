import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold font-serif mb-2">Account Settings</h1>
				<p className="text-lg text-muted-foreground dark:text-gray-300">Manage your profile, security, and linked identities securely.</p>
			</div>
			
      <div className="flex justify-center w-full">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
