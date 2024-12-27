export function getWeekNumber(date: Date | number): number {
	const targetDate = new Date(date); // Create a copy of the date to avoid mutation
	targetDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00
	// Set date to Thursday in current week
	targetDate.setDate(targetDate.getDate() + (4 - (targetDate.getDay() || 7)));
	// Start of the year
	const startOfYear = new Date(targetDate.getFullYear(), 0, 1);
	// Calculate full weeks to the date
	const weekNumber = Math.ceil(((+targetDate - +startOfYear) / 86400000 + 1) / 7);
	return weekNumber;
}