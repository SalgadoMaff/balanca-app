<script>
export default {
  name: "Logout",
  created() {
    localStorage.removeItem("token")
    this.$store.dispatch("user/clearUserData")
    this.$router.push({ path: "/" })
  }
}
</script>