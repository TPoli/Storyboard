import { defineComponent } from 'vue';

import Bookmark from '@/branding/icons/bookmark/bookmark.vue';
import Home from '@/branding/icons/home/home.vue';
import Tooltip from '@/components/tooltip/tooltip.vue';
import { paths, setRoute } from '@/router';
import { getState, setState, StoreComponent } from '@/store';
import { Breadcrumb, UserContext } from '@/userContext';

type BreadcrumbsData = {
	
};

const Breadcrumbs = defineComponent({
	name: 'Breadcrumbs',
	components: {
		Home: Home,
		Tooltip: Tooltip,
		Bookmark: Bookmark,
	},
	props: {
		
	},
	data: function (): BreadcrumbsData {
		return {
			
		};
	},
	methods: {
		breadcrumbClicked(breadcrumb: Breadcrumb) {
			setState(this as unknown as StoreComponent).updateUserContext({
				currentIndex: this.contents.findIndex(b => b.id === breadcrumb.id),
				history: [
					...((this as any).userContext.history)
				],
			});

			switch (breadcrumb.type) {
				case 'Dashboard':
					setRoute(this, '/dashboard');
					break;
				case 'Collection':
					setRoute(this, '/collection/' + breadcrumb.id  as unknown as paths);

					setState(this as unknown as StoreComponent).setCurrentCollection(breadcrumb.id);
					break;
				default:
					break;
			}
		},
		getTooltipSide(breadcrumbTooltip: string, breadcrumbIndex: number) {
			// TODO create a proper method of getting this
			const width = 8 * breadcrumbTooltip.length;
			const offset = 40 * breadcrumbIndex;
			if (offset - width / 2 < 0) {
				return 'right';
			}
			// TODO method find if tooltip would go off the right edge and make it return "left" if it would

			return 'bottom';
		},
		isCurrentBreadcrumb(breadcrumbIndex: number) {
			return this.userContext.currentIndex === breadcrumbIndex;
		}
	},
	computed: {
		userContext() {
			return new UserContext(getState(this as unknown as StoreComponent).userContext);
		},
		contents(): Breadcrumb[] {
			const userContext: UserContext = (this as any).userContext;

			return [
				{
					title: 'Dashboard',
					id: 'Dashboard',
					type: 'Dashboard',
				},
				...userContext.history,
			];
		}
	},
});

export default Breadcrumbs;