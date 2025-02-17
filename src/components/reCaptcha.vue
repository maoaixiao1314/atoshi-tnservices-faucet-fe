<template>
  <div>
  </div>
</template>

<!-- <script>
export default {
  methods: {
    loaded() {
      window.grecaptcha.render(this.$refs.grecaptcha, {
        sitekey: process.env.VUE_APP_RECAPTCHA_KEY,
        size:"invisible",

        /**

        * res返回的是goole的验证情况，

        * 成功返回字符串

        * 失败不返回字符串

        * 所以根据字符串判断验证情况

        */

        callback: (res) => {
          res.length > 0 ?  this.$emit('getValidateCode', res) : this.$emit('getValidateCode', false)
        },
      })
    },
    reset () {
      window.grecaptcha.reset(this.$refs.grecaptcha)
    },
    handle(){
      window.grecaptcha.execute()
    }
  },

  mounted() {
    window.ReCaptchaLoaded = this.loaded
    var script = document.createElement('script')
    script.src = 'https://recaptcha.net/recaptcha/api.js?onload=ReCaptchaLoaded&render=explicit'
    document.head.appendChild(script)
  },
}
</script> -->
