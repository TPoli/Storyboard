type EntityType = 'Location' | 'Character' | 'Object';

class Entity {
	type: EntityType;
	constructor(type: EntityType) {
		this.type = type;
	}
	move(distanceInMeters: number = 0) {
		console.log(`${this.type} moved ${distanceInMeters}m.`);
	}
}

export { Entity };
export { EntityType};
