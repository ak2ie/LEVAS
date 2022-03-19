<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link to="/" class="d-flex align-center">
            <!-- <v-img
              :src="require('@/assets/images/logos/logo.svg')"
              max-height="30px"
              max-width="30px"
              alt="logo"
              contain
              class="me-3 "
            ></v-img> -->

            <h2 class="text-2xl font-weight-semibold">LINEイベント管理</h2>
          </router-link>
        </v-card-title>

        <!-- title -->
        <!-- <v-card-text>
          <p class="text-2xl font-weight-semibold text--primary mb-2">
            Welcome to Materio! 👋🏻
          </p>
          <p class="mb-2">
            Please sign-in to your account and start the adventure
          </p>
        </v-card-text> -->

        <!-- login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              outlined
              label="Email"
              placeholder="john@example.com"
              hide-details
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Password"
              placeholder="············"
              :append-icon="
                isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline
              "
              hide-details
              @click:append="isPasswordVisible = !isPasswordVisible"
            ></v-text-field>

            <div class="d-flex align-center justify-space-between flex-wrap">
              <v-checkbox label="Remember Me" hide-details class="me-3 mt-1">
              </v-checkbox>

              <!-- forgot link -->
              <!-- <a
                href="javascript:void(0)"
                class="mt-1"
              >
                Forgot Password?
              </a> -->
            </div>

            <v-btn
              block
              color="primary"
              class="mt-6"
              :loading="isLogging == true"
              @click="login"
            >
              Login
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- background triangle shape  -->
    <img
      class="auth-mask-bg"
      height="173"
      :src="$vuetify.theme.dark ? imgMaskDarkPath : imgMaskLightPath"
    />

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      :src="imgTreePath"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      :src="imgTree2Path"
    ></v-img>
    <div class="text-center">
      <v-snackbar v-model="snackbar">
        {{ notifyText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { defineComponent, ref } from '@nuxtjs/composition-api'
import imgTreePath from '@/assets/images/misc/tree.png'
import imgTree2Path from '@/assets/images/misc/tree-3.png'
import imgMaskLightPath from '@/assets/images/misc/mask-light.png'
import imgMaskDarkPath from '@/assets/images/misc/mask-dark.png'

export default defineComponent({
  layout: 'Blank',
  setup(_, context) {
    const isPasswordVisible = ref(false)
    const email = ref('')
    const password = ref('')
    /**
     * ログイン処理中であるか
     */
    const isLogging = ref(false)
    /**
     * 通知
     */
    const snackbar = ref(false)
    const notifyText = ref('')

    const login = async () => {
      if (email.value === '') {
        return
      }
      isLogging.value = true
      try {
        const res = await context.root.$fire.auth.signInWithEmailAndPassword(
          email.value,
          password.value
        )
        if (res !== null && res.user !== null) {
          const idToken = res.user.getIdToken(true)
          if (idToken !== undefined) {
            localStorage.setItem('access_token', idToken.toString())
          }
          localStorage.setItem(
            'refresh_token',
            res.user.refreshToken.toString()
          )
        }
      } catch (e) {
        notifyText.value = 'ログインに失敗しました'
        snackbar.value = true
        isLogging.value = false
      }
    }

    return {
      isPasswordVisible,
      email,
      password,
      login,
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
      isLogging,
      snackbar,
      notifyText,
      imgTree2Path,
      imgTreePath,
      imgMaskLightPath,
      imgMaskDarkPath,
    }
  },
})
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
