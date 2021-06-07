export default {
    methods: {
        hasAccess(path) {
            const applicationRoutes = this.$router.options.routes
            const userRole = this.$store.state.user.user.role

            const match = applicationRoutes.find(route => route.path === path)

            if (match && match.meta && match.meta.authorizationRequired) {
                if (userRole != match.meta.role) {
                    return false
                }
            }

            return true
        }
    }
}