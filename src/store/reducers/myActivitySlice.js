import {
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from '@reduxjs/toolkit';
import {
	addImageAction,
	deleteImageAction,
	deleteImageByFullPathAction,
	fetchRegisteredActivityAction,
	getImageProofByActivityAction,
	registerActivityAction,
	removeRegisteredActivityAction,
} from '../actions';

export const myActivitySlice = createSlice({
	name: 'myActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	reducers: {
		addImageToActivityAction: (state, action) => {
			const { acId, image } = action.payload;
			let images = state.value.find((c) => c.id === acId)['images'] || [];
			images.push(image);

			let newValue = state.value.map((c) =>
				c.id === acId
					? {
							...c,
							images,
					  }
					: c
			);
			state.value = newValue;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(
				fetchRegisteredActivityAction.fulfilled,
				(state, action) => {
					state.value = action.payload;
				}
			)
			.addCase(registerActivityAction.fulfilled, (state, action) => {
				state.value.push(action.payload);
			})
			.addCase(
				removeRegisteredActivityAction.fulfilled,
				(state, action) => {
					state.value = state.value.filter(
						(c) => c.id != action.payload
					);
				}
			)
			.addCase(addImageAction.fulfilled, (state, action) => {
				const { fileName, acId } = action.payload;
				state.value = state.value.map((c) => {
					if (c.id == acId) {
						let images = c.images || [];
						images.push(fileName);
						return { ...c, images };
					}
					return c;
				});
			})
			.addCase(deleteImageAction.fulfilled, (state, action) => {
				const { fileName, acId } = action.payload;
				state.value = state.value.map((c) => {
					if (c.id == acId) {
						let images = c.images;
						images.splice(images.indexOf(fileName), 1);
						return { ...c, images };
					}
					return c;
				});
			})
			.addCase(deleteImageByFullPathAction.fulfilled, (state, action) => {
				const { path, acId } = action.payload;
				state.value = state.value.map((c) => {
					if (c.id === acId) {
						let images = c.images.filter(
							(e) => e.fullPath !== path
						);
						return { ...c, images };
					}
					return c;
				});
			})
			.addCase(
				getImageProofByActivityAction.fulfilled,
				(state, action) => {
					const { acId, images } = action.payload;
					let newState = state.value.map((c) =>
						c.id === acId ? { ...c, images } : c
					);
					state.value = newState;
				}
			);
		builder
			.addMatcher(isPending, (state, action) => {
				state.loading = state.loading + 1;
			})
			.addMatcher(isRejected, (state, action) => {
				state.loading = state.loading - 1;
			})
			.addMatcher(isFulfilled, (state, action) => {
				state.loading = state.loading - 1;
			});
	},
});

export const { addImageToActivityAction } = myActivitySlice.actions;

export default myActivitySlice.reducer;
