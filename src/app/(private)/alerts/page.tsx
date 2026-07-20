"use client";

import { AlertsPageHeader } from "@/features/alerts/components/alerts-page-header";
import { AlertsTable } from "@/features/alerts/components/alerts-table";

export default function AlertsPage() {
	return (
		<div className="space-y-8">
			<AlertsPageHeader />

			<section aria-labelledby="alerts-list" className="space-y-4">
				<header>
					<h2 id="alerts-list" className="text-lg font-semibold text-white">
						Alert Rules
					</h2>
				</header>

				<AlertsTable />
			</section>
		</div>
	);
}
