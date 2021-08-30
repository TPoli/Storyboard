import { Passport } from 'passport';

export default class Storyboard {

	private static instance: Storyboard|null = null;
	public passport: any = null;

	constructor () {
		this.passport = new Passport();
	}
	
	public static Instance = (): Storyboard => {
		if (!Storyboard.instance) {
			Storyboard.instance = new Storyboard();
		}
		return Storyboard.instance;
	};
};