
export default {
    name: 'Modal',
    methods: {
        close() {
            (this as any).$emit('close');
        },
    },
};