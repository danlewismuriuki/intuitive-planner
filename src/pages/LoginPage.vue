<template>
  <div class="login-page q-pa-md flex flex-center" style="background: #2D2D3A; min-height: 100vh; color: white;">
    <q-card class="login-card" style="background: rgba(255,255,255,0.05); border-radius: 12px;">
      <q-card-section class="bg-orange-8" style="border-radius: 12px 12px 0 0;">
        <div class="text-h6 text-white">Data Centre Login</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit.prevent="handleLogin" ref="loginForm">
          <q-input v-model="username" label="Username" dark outlined class="q-mb-md" bg-color="rgba(255,255,255,0.05)"
            :rules="[(val) => !!val || 'Username is required']">
            <template v-slot:prepend>
              <q-icon name="person" color="grey" />
            </template>
          </q-input>

          <q-input v-model="password" label="Password" type="password" dark outlined bg-color="rgba(255,255,255,0.05)"
            :rules="[(val) => !!val || 'Password is required']">
            <template v-slot:prepend>
              <q-icon name="lock" color="grey" />
            </template>
          </q-input>

          <q-btn type="submit" label="Login" color="orange" class="full-width q-mt-lg"
            style="background: #FF6B2C; border-radius: 8px; font-weight: 500; letter-spacing: 0.5px;"
            :loading="loading">
            <template v-slot:loading>
              <q-spinner-oval />
            </template>
          </q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import LoginService from 'src/services/loginService';

export default defineComponent({
  name: 'LoginPage',

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const loginForm = ref(null);

    const handleLogin = async () => {
      try {
        loading.value = true;
        const response = await LoginService.login({
          username: username.value,
          password: password.value,
        });
        LoginService.storeToken(response.token);
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      loading,
      loginForm,
      handleLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-page {
  .login-card {
    width: 400px;
    max-width: 90%;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .q-card__section {
      .text-h6 {
        font-weight: 300;
        letter-spacing: 0.5px;
      }
    }
  }

  .q-input {
    .q-field__control {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .q-field__label {
      color: rgba(255, 255, 255, 0.7);
    }

    &.q-field--focused {
      .q-field__control {
        border-color: #FF6B2C;
      }
    }
  }

  @media (max-width: 600px) {
    .login-card {
      width: 100%;
      margin: 1rem;
    }
  }
}
</style>
