<template>
  <div class="app">
    <div class="content">
      <div class="title">Hetu Testnet <span class="text-green">Faucet</span></div>
      <el-form :model="formData" ref="form" class="form" @validate = "validate">
        <div class="form_content">
          <el-form-item :error="error" prop="account" class="fill form-item"
          :rules="[
            {
              required: true,
              message: 'Input your hetu-hub testnet address or a forwarded link',
              trigger: 'default'
            },
            {
              pattern: /(^0x[a-fA-F0-9]{40}$)|(^(https:\/\/)|(http:\/\/))/,
              message: 'Please enter the correct content!',
              trigger: 'default'
            }
          ]">
            <el-input class="input_content" :placeholder="placeholder" type="text" clearable
              v-model.trim="formData.account" @focus="handleFocus" @blur="handleBlur" @keypress.enter.prevent="handleSubmit"/>
          </el-form-item>
          <el-form-item class="form-item" :class="{loading: loading}">
            <el-button class="btn" type="primary" :disabled="loading" @click="handleSubmit">
              {{ txt }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="rule_content">
      <div class="rule_title">Rules:</div>
      <ol>
        <li class="rule"> You need to connect to Hetu Testnet, otherwise HHUB cannot be viewed in MetaMask.</li>
        <li class="rule">
           Input your hetu-hub account to get a login bonus once a day: 1HHUB, claim every 7 consecutive days, the reward is doubled on the 7th da.
        </li>
        <!-- <li class="rule"> Retweet the login bonus information to twitter, and enter the retweeted twitter address to get 5 UNIT and 100 TAT again.</li> -->
        <!-- <li class="rule">
          Retweet the login bonus information to twitter and follow the <a href="https://twitter.com/treasurenet_io?s=20&t=omYlcXClXYVtJMeTOJh54g " class = "link" target="_blank">treasurenet twitter account</a>, and enter the retweeted twitter address to get 5 UNIT and 100 TAT again.
        </li> -->
      </ol>
    </div>
  </div>
  <reCaptcha ref="reCaptcha" @getValidateCode="getValidateCode" v-model="formData.recaptcha"></reCaptcha>
  <el-dialog v-model="dialogVisible" center custom-class="sign_dialog"  :show-close="false"
    width="7.28rem">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" class = "fill" :class="titleClass" v-html = "title"></h4>
        <!-- <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button> -->
        <div class="close"  @click="close">
        </div>
      </div>
    </template>
    <Transition name = "el-fade-in-linear" mode = "out-in">
      <div class="share_content" v-if = "infoLoading">
        <img :src="`${giftPC}?${timeStr}`" v-if = "dialogVisible" alt="" class="pc_show share_img"/>
        <img :src="`${giftMobile}?${timeStr}`" v-if = "dialogVisible" alt="" class="mobile_show share_img"/>
      </div>
      <div class="timeline" v-else>
        <template v-for="(item, index) in timeMenu" :key="`time_${index}`">
          <div class="line" :class="{ signed: item.status === 'signed' || item.status === 'doudleSigned', unsign: item.status === 'unsign' || item.status === 'doudleReward' }"
            v-if="index > 0" :key="`time_line_${index}`"></div>
          <div class="time_menu" :class="{ signed: item.status === 'signed', unsign: item.status === 'unsign', 'doudle_reward': item.status === 'doudleReward', 'doudle_signed': item.status === 'doudleSigned' }">
            <div class="top" v-if="item.status === 'signed' || item.status === 'doudleSigned'">
              <div class="unit">+{{ item.unit }} UNIT</div>
              <div class="tat">+{{ item.total }} TAT</div>
            </div>
            <div class="bottom">
              {{ item.title }}
            </div>
          </div>
        </template>
      </div>
    </Transition>
      <template #footer>
        <Transition name = "el-fade-in-linear" mode = "out-in">
          <span class="dialog-footer"  v-show = "!infoLoading">
            <el-button type="primary" class="sign_btn" @click="handleSign">Share to get more rewards</el-button>
          </span>
        </Transition>
      </template>
  </el-dialog>
  <!--  分享奖励对话框  -->
  <!-- <el-dialog v-model="dialogShareVisible" destroy-on-close center width="7.28rem" custom-class="dialog"   :show-close="false">
  <template #header="{ close }">
      <div class="my-header">
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
        <div class="close"  @click="close">
        </div>
      </div>
    </template>
    <div class="share_content">
      <img :src="`${giftPC}?${timeStr}`" v-if = "dialogShareVisible" alt="" class="pc_show share_img"/>
      <img :src="`${giftMobile}?${timeStr}`" v-if = "dialogShareVisible" alt="" class="mobile_show share_img"/>
      <div class="share_desc">UNIT & TAT have been <br class="mobile_show"/> sent to you!</div>
    </div>
    <template #footer v-if = "signStatus === 'share'">
      <span class="dialog-footer">
        <el-button type="info" class="share_btn" link @click="dialogShareVisible = false">OK</el-button>
      </span>
    </template>
  </el-dialog> -->
</template>
<script>
import reCaptcha from '@/components/reCaptcha.vue'
import axios from 'axios'
import moment from 'moment'
const placeholderStr = 'Input your hetu testnet address or a forwarded link…'
export default {
  name: 'app',
  data () {
    return {
      loading: false,
      formData: {
        recaptcha: '',
        account: ''
      },
      error: '',
      // 0x631F0a288e5F05A26837948Eea559279d734444F
      // txt: 'Connect your wallet'
      txt: 'Give me HHUB',
      dialogVisible: false,
      dialogShareVisible: false,
      timeMenu: [],
      timeStr: '',
      giftPC: require('@/assets/image/signing_pc.gif'),
      giftMobile: require('@/assets/image/signing_mobile.gif'),
      errTime: null,
      idx: 0,
      signStatus: '',
      infoLoading: false,
      infoTime: null,
      placeholder: placeholderStr,
      title: ''
    }
  },
  components: {
    reCaptcha
  },
  methods: {
    handleSign () {
      this.dialogVisible = false
      window.setTimeout(() => {
        this.pushSignLog()
        window.open(`https://twitter.com/intent/tweet?text=Requesting%20faucet%20funds%20into%20 ${this.formData.account}%20on%20the%20%23treasurenet%20test%20network.`)
      })
    },
    pushSignLog () {
      let signLog = window.localStorage.getItem('signLog') || '{}'
      signLog = JSON.parse(signLog)
      signLog[this.formData.account] = moment().format('yyyy-MM-DD')
      window.localStorage.setItem('signLog', JSON.stringify(signLog))
    },
    getSignLog () {
      let signLog = window.localStorage.getItem('signLog') || '{}'
      signLog = JSON.parse(signLog)
      return signLog[this.formData.account]
    },
    handleFocus () {
      this.placeholder = ''
    },
    handleBlur () {
      this.placeholder = placeholderStr
    },
    validate () {
      window.clearTimeout(this.errTime)
      this.errTime = window.setTimeout(() => {
        this.error = ''
        this.$refs.form.clearValidate()
      }, 3000)
    },
    handleSubmit () {
      this.error = ''
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.reCaptcha.handle()
        }
      })
    },
    getValidateCode(value) {
      this.formData.recaptcha = value
      this.submitValidate()
    },
    async getSignRecard () {
      const res = await axios.get(`${process.env.VUE_APP_BASE_API}/info`, {
        params: {
          'g-recaptcha-response': this.formData.recaptcha,
          account: this.formData.account
        }
      })
      if (Array.isArray(res.data.result.checkIn)) {
        this.timeMenu = this.setTimeRecard(res.data.result.checkIn)
      }
    },
    setTimeRecard (arr) {
      let resultArr = []
      let lastDate = null
      const today = moment().format('yyyy-MM-DD')
      for (let i = 0; i< 7; i++) {
        let title = ''
        if (arr[i]) {
          lastDate = moment(new Date(arr[i])).format('yyyy-MM-DD')
        } else {
          lastDate = moment(lastDate).add(1, 'd').format('yyyy-MM-DD')
        }
        const flag = today === lastDate
        if (flag) {
          title = 'Today'
        } else {
          title = `Day ${i+1}`
        }
        if (arr[i] && i < 6) {
          resultArr.push({
            status: 'signed',
            unit: 5,
            total: 100,
            title
          })
        } else if (i < 6){
          resultArr.push({
            status: 'unsign',
            title
          })
        } else if (arr[i] && i == 6) {
          resultArr.push({
            status: 'doudleSigned',
            unit: 10,
            total: 200,
            title
          })
        } else {
          resultArr.push({
            status: 'doudleReward',
            title
          })
        }
      }
      return resultArr
    },
    async getBasicInfo () {
      try {
        const today = moment().format('yyyy-MM-DD')
        const res = await axios.post(`${process.env.VUE_APP_BASE_API}/basic`, {
          'g-recaptcha-response': this.formData.recaptcha,
          account: this.formData.account
        }, {
          timeout: 100000
        })
        if (res.data.code === '0') {
          if (res.data.result === 'complete.' || (res.data.result === 'You can only get it once a day!' && today != this.getSignLog())) {
            if (res.data.result === 'complete.') {
              this.title = `HHUB have been <br class="mobile_show"/> sent to you!`
            } else {
              this.title = `You have already claimed your <br class="mobile_show"/> reward today`
            }
            this.signStatus = 'basic'
            this.timeStr = (new Date()).getTime()
            this.dialogVisible = true
            this.infoLoading = true
            await this.getSignRecard()
            this.infoTime = window.setTimeout(() => {
              this.infoLoading = false
            }, 1300)
          } else {
             throw new Error(res.data.result)
          }
        } else {
          throw new Error(res.data.error)
        }
      } catch (err) {
        this.error = err.message

      }
    },
    async receive () {
      try {
        const res = await axios.post(`${process.env.VUE_APP_BASE_API}/twitter`, {
          'g-recaptcha-response': this.formData.recaptcha,
          url: this.formData.account
        }, {
          timeout: 100000
        })
        if (res.data.code === '0') {
          if (res.data.result === 'complete.') {
            this.signStatus= 'share'
            this.timeStr = (new Date()).getTime()
            this.dialogShareVisible = true
          } else {
             throw new Error(res.data.result)
          }
        } else {
          throw new Error(res.data.error)
        }
      } catch (err) {
        this.error = err.message
      }
    },
    submitValidate () {
      this.loading = true
      if (this.formData.account.startsWith('https://') || this.formData.account.startsWith('http://')) {
        this.receive().finally(() => {
          this.loading = false
          this.$refs.reCaptcha.reset()
        })
      } else {
        this.getBasicInfo().finally(() => {
          this.loading = false
          this.$refs.reCaptcha.reset()
        })
      }
    }
  }
}
</script>
<style src="@/style/index.scss" lang="scss"></style>
<style lang="scss" scoped>
  ::v-deep(.mobile_show){
    display: none;
    @media screen and (max-width: 900px) {
      display: block;
    }
  }
  .pc_show{
    display: block;
    @media screen and (max-width: 900px) {
      display: none;
    }
  }
  .app {
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 0.34rem;
    font-family: DMSans-Bold, DMSans;
    display: flex;
    color: #fff;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background: url('@/assets/image/bg.png') no-repeat top center/cover;
    @media screen and (max-width: 900px) {
      background: url('@/assets/mobileImage/bg.png') no-repeat top center/cover;
      padding: 18px 16px;
    }

  }
  .mobile_logo{
    width: .84rem;
    align-self: flex-start;
    margin-left: .33rem;
  }
  .title {
    font-size: .64rem;
    font-weight: bold;
    line-height: .82rem;
    margin: 1.03rem auto 1.3rem;
    text-align: center;
    .text-green{
      color:#38F4BA;
    }
    @media screen and (max-width: 900px) {
      margin: 46px 0 64px;
      font-size: 48px;
      line-height: 60px;
    }
  }
  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    @media screen and (max-width: 900px) {
      font-size: 0.34rem;
      font-family: DMSans-Bold, DMSans;
      font-weight: bold;
      color: #333333;
      line-height: 0.57rem;
    }
    .close{
      position: absolute;
      right: .32rem;
      top: .24rem;
      width: .2rem;
      height: .2rem;
      cursor: pointer;
      background: url('~@/assets/image/close.png') no-repeat center center/contain;
      @media screen and (max-width: 900px)  {
        width: .76rem;
        height: .76rem;
        background: url('~@/assets/mobileImage/close.png') no-repeat center center/contain;
        top: .3rem;
        right: .38rem;
      }
    }
  }
  .form {
    max-width: 11.31rem;
    width: 100%;
    margin: 0 auto;
  }
  .input_content {
    flex: 1;
    ::v-deep(.el-input__wrapper) {
      padding: 12px 16px;
      background-color: transparent;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: none!important;
      .el-input__inner {
        font-size: 20px;
        height: 30px;
        line-height: 1.5;
        font-weight: 400;
        font-family: DMSans-Regular, DMSans;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #ECECEC;
      }
      .el-input__icon{
        font-size: 28px;
      }
    }
  }
  .is-error{
    ::v-deep(.el-input__wrapper) {
      border-color: #FF2900;
    }
  }
  .form_content{
    display: flex;
    @media screen and (max-width: 900px) {
      flex-direction: column;
    }
  }
  .form-item {
    &.fill{
      flex: 1;
    }
    @media screen and (max-width: 900px) {
      margin-bottom: 0.38rem;
      flex: 1;
      &.is-error{
        margin-bottom: 0;
      }
    }
    ::v-deep(.el-form-item__content) {


      .el-form-item__error {
        font-size: 18px;
        font-family: DMSans-Regular, DMSans;
        font-weight: 400;
        color: #FF2900;
        line-height: 30px;
        padding: 12px 16px;
        @media screen and (max-width: 900px) {
          font-size: 0.34rem;
          line-height: 0.57rem;
          flex: 0 auto;
          width: 100%;
          position: static;
        }
      }
    }

    &.loading {
      ::v-deep(.el-form-item__content) {
        position: relative;

        &::after {
          content: '';
          width: .47rem;
          height: .47rem;
          position: absolute;
          top: 0;
          bottom: 0;
          left: calc(100% + .2rem);
          margin: auto;
          background: url('@/assets/image/loading.png') no-repeat center center/contain;
          animation: rotating 2s linear infinite;
          @media screen and (max-width: 900px) {
            position: static;
            width: .76rem;
            height: .76rem;
          }
        }
      }
    }
  }

  .btn {
    margin-left: 16px;
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    border-radius: 8px;
    font-size: 18px;
    font-family: DMSans-Bold, DMSans;
    color: #fff;
    background: linear-gradient(264deg, #225BFC 0%, #062567 100%);
    border: none;

    @media screen and (max-width: 900px) {
      margin-left: 0;
      width: 100%;
    }
  }

  .share_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0.4rem;
    @media screen and (max-width: 900px) {
      padding-bottom: 0.38rem;
    }
    .share_img {
      width: 2.24rem;
      margin-bottom: .32rem;
      @media screen and (max-width: 900px) {
        width: 3.44rem;
        margin-bottom: .61rem;
      }
    }

    .share_desc {
      font-size: 0.24rem;
      font-family: DMSans-Bold, DMSans;
      font-weight: bold;
      color: #333333;
      line-height: 0.38rem;
      text-align: center;
      @media screen and (max-width: 900px) {
        font-size: 0.34rem;
        line-height: 0.57rem;
      }
    }
  }

  .sign_btn {
    width: 3.01rem;
    height: 0.55rem;
    border-radius: 0.2rem;
    font-size: 0.18rem;
    font-family: DMSans-Medium, DMSans;
    font-weight: 500;
    box-sizing: border-box;
    line-height: 0.24rem;
    background: linear-gradient(264deg, #225BFC 0%, #062567 100%);
    @media screen and (max-width: 900px) {
      font-size: 0.3rem;
      line-height: 0.42rem;
      padding: .17rem .3rem;
      width: 4.45rem;
      height: .76rem;
    }
  }

  .share_btn {
    font-size: 0.2rem;
    font-family: DMSans-Bold, DMSans;
    font-weight: bold;
    line-height: 0.26rem;
    width: 0.29rem;
    height: 0.26rem;
    @media screen and (max-width: 900px) {
      width: 0.4rem;
      height: 0.34rem;
      font-size: 0.27rem;
      line-height: 0.34rem;
    }
  }

  .content {
    width: 100%;
    max-width: 10.64rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .rule_content {
    width: 100%;
    max-width: 10.64rem;
    margin-top: 1.3rem;
    ol{
      padding-left: 0.2rem;
    }
    .rule {
      margin-top: 8px;
      font-weight: 400;
      font-family: DMSans-Regular, DMSans;
      font-size: 16px;
      line-height: 1.5;
      color: rgba(255,255,255,0.65);
      @media screen and (max-width: 900px) {
        font-size: 14px;
      }
    }
  }

  .rule_title {
    font-size: 20px;
    line-height: 1.6;
    color: rgba(255,255,255,0.8);
  }

  .timeline {
    display: flex;
    justify-content: space-between;
    margin-top: 1.05rem;
    margin-bottom: 1.15rem;
    align-items: center;
     @media screen and (max-width: 900px) {
      margin-top: 1.39rem;
      margin-bottom: 1.56rem;
    }
    .line {
      flex: 1;
      height: .06rem;
      margin-top: .14rem;
      transform: scaleX(1.5);

      &.unsign {
        background-color: #9D9DA0FF;
      }

      &.signed {
        background-color: #FFEBC8FF;
      }
    }

    .time_menu {
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: .57rem;
      height: .57rem;
      position: relative;
      z-index: 2;
      @media screen and (max-width: 900px) {
        width: .61rem;
        height: .61rem;
      }

      .top,
      .bottom {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        white-space: nowrap;
        @media screen and (max-width: 900px) {
          width: .76rem;
          margin: 0 auto;
        }
      }

      .top {
        top: 0;
        transform: translate(0%, -100%);
        font-size: 0.15rem;
        font-family: DMSans-Regular, DMSans;
        font-weight: 400;
        color: #333333;
        line-height: 0.2rem;
        @media screen and (max-width: 900px) {
          font-size: 0.17rem;
          line-height: 0.23rem;
          transform: translate(-25%, -100%) scale(.75);
        }
      }

      .bottom {
        font-size: 0.18rem;
        font-family: DMSans-Regular, DMSans;
        font-weight: 400;
        color: #9D9DA0;
        line-height: 0.21rem;
        bottom: 0;
        transform: translate(0, calc(0.05rem + 100%));
        @media screen and (max-width: 900px) {
          font-size: 0.21rem;
          line-height: 0.27rem;
          transform: translateY(-25%, calc(100% + 0.08rem)) scale(.75);
        }
      }
      &.unsign {
        background-image: url('~@/assets/image/sign.png');
      }
      &.signed {
        background-image: url('~@/assets/image/signed.png');
      }
      &.doudle_reward{
        background-image: url('~@/assets/image/DoubleReward.png');
        background-size: contain;
        width: .71rem;
        height: .71rem;
        @media screen and (max-width: 900px) {
          width: .76rem;
          height: .76rem;
        }
        .top {
          top: .075rem;
          @media screen and (max-width: 900px) {
            top: .008rem;
          }
        }
        .bottom{
          bottom: 0.075em;
          transform: translateY(100%);
          @media screen and (max-width: 900px) {
            bottom: .008rem;

          }
        }
      }
      &.doudle_signed{
        background-image: url('~@/assets/image/doudleSign.png');
        background-size: contain;
        width: .71rem;
        height: .71rem;
        @media screen and (max-width: 900px) {
          width: .76rem;
          height: .76rem;
        }
        .top {
          top: .075rem;
          @media screen and (max-width: 900px) {
            top: .008rem;
          }
        }
        .bottom{
          bottom: 0.075em;
          transform: translateY(100%);
          @media screen and (max-width: 900px) {
            bottom: .008rem;
          }
        }
      }
    }
  }
  .link{
    text-decoration: none;
    cursor: pointer;
    color: #007AFF;
  }
</style>