

export const MinutesToMilliseconds = (minutes: number) => {
	return minutes * 60 * 1000;
};

export const SecondsToMilliseconds = (seconds: number) => {
	return seconds * 1000;
};

export const MillisecondsToMinutes = (milliseconds: number) => {
	return milliseconds / 60 / 1000;
};

export const MillisecondsToSeconds = (milliseconds: number) => {
	return milliseconds / 1000;
};