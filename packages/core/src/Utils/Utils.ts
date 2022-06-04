

const MinutesToMilliseconds = (minutes: number) => {
	return minutes * 60 * 1000;
};

const SecondsToMilliseconds = (seconds: number) => {
	return seconds * 1000;
};

const MillisecondsToMinutes = (milliseconds: number) => {
	return milliseconds / 60 / 1000;
};

const MillisecondsToSeconds = (milliseconds: number) => {
	return milliseconds / 1000;
};

const CamelCase = (strings: string[]): string => {
	let result = '';
	
	for (let i = 0; i < strings.length; ++i) {
		const lower = strings[i].toLowerCase();
		if (i > 0) {
			result += lower.charAt(0).toUpperCase() + lower.substring(1); 
		} else {
			result += lower;
		}
	}
	
	return result;
};

export {
	CamelCase,
	MillisecondsToSeconds,
	MillisecondsToMinutes,
	SecondsToMilliseconds,
	MinutesToMilliseconds,
}