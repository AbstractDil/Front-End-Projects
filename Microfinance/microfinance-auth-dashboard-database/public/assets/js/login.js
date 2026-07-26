function loginForm() {
  return {
    email: '',
    password: '',
    loading: false,
    errorMessage: '',
    fieldErrors: {},

    async submit() {
      this.loading = true;
      this.errorMessage = '';
      this.fieldErrors = {};

      try {
        const { data } = await MFI.api.post('/auth/login', {
          email: this.email,
          password: this.password,
        });

        MFI.setSession({
          access_token: data.data.access_token,
          refresh_token: data.data.refresh_token,
          user: data.data.user,
        });

        window.location.href = '/dashboard';
      } catch (err) {
        if (err.response && err.response.status === 422) {
          this.fieldErrors = err.response.data.errors || {};
        }
        this.errorMessage = (err.response && err.response.data && err.response.data.message)
          ? err.response.data.message
          : 'Unable to sign in. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  };
}
