import vue from '@vitejs/plugin-vue';

export default {
    plugins: [vue()],
    resolve: {
        extensions: ['.js', '.scss', '.vue']
    }
};
