<template src='./Container.html' />

<style scoped src='./Container.css' > </style>

<script>
import { Entity } from '../../../Core/types/Entity';

export default {
name: "Container",
	props: {
		msg: String,
	},
	methods: {
		test() {
			const entity = new Entity('Location');
			entity.move(7);
			return 'test';
		}
	}
};
</script>
