<template>
    <Login v-if="$route.path === '/login'" />
    <Error v-else-if="$route.path === '/error'" />
    <NotFound v-else-if="$route.path === '/notfound'" />
    <Access v-else-if="$route.path === '/access'" />
    <App v-else @change-theme="changeTheme" />
</template>

<script>
    import EventBus from './AppEventBus';
    import App from './App';
    import Login from './pages/general/Login';
    import Error from './pages/Error';
    import NotFound from './pages/NotFound';
    import Access from './pages/Access';

    export default {
        methods: {
            changeTheme(event) {
                let themeElement = document.getElementById('theme-link');
                themeElement.setAttribute('href', themeElement.getAttribute('href').replace(this.$appState.theme, event.theme));
                this.$appState.theme = event.theme;
                this.$appState.darkTheme = event.dark;
                EventBus.emit('change-theme', event);

                if (event.theme.startsWith('md')) {
                    this.$primevue.config.ripple = true;
                }
            }
        },
        components: {
            App,
            Login,
            Error,
            NotFound,
            Access
        }
    }
</script>