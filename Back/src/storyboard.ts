export default class Storyboard {

	private static instance: Storyboard|null = null;

	public static Instance = (): Storyboard => {
		if (!Storyboard.instance) {
			Storyboard.instance = new Storyboard();
		}
		return Storyboard.instance;
	};
}