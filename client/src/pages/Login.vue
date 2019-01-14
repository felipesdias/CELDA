<template>
  <div class="background-login">
    <q-card class="q-pa-xl fixed-center card-login">
      <img src="statics/zelda-login-2.png" style="max-width: 350px;"> 

      <div class="column q-mt-md">
        <q-field :error="$v.user.matricula.$error"
                 :error-label="$utils.errorMsg('Matrícula', $v.user.matricula)">
          <q-input v-model="user.matricula" 
                   float-label="Matrícula" 
                   class="input-login"
                   @blur="$v.user.matricula.$touch"
                   @keyup.enter="logar"/>
        </q-field>
        <q-field :error="$v.user.senha.$error"
                 :error-label="$utils.errorMsg('Senha', $v.user.senha)">
          <q-input v-model="user.senha" 
                   float-label="Senha" 
                   class="input-login"
                   @blur="$v.user.senha.$touch"
                   type="password"
                   @keyup.enter="logar"/>
        </q-field>
        <q-btn class="q-mt-lg" style="background: #0e5135; color: white" 
               :loading="loader.login"
               @click="logar"> Entrar </q-btn>
      </div>
    </q-card>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    data() {
        return {
            loader: {
                login: false
            },
            user: {
                matricula: '',
                senha: '',
            }
        };
    },
    validations: {
        user: {
            matricula: {
                required,
                minLength: minLength(3)
            },
            senha: {
                required,
                minLength: minLength(6)
            }
        }
    },
    methods: {
        logar() {
            this.$v.user.$touch();

            if (this.$v.user.$error) {
                this.$q.notify('Verifique os campos novamente!');
                return;
            }

            this.loader.login = true;

            this.$axios.post('login', this.user).then(response => {
                this.$q.sessionStorage.set('token', response.token);
                this.$q.sessionStorage.set('user', response.user);
                this.loader.login = false;

                if(response.user.tipo === 'adm' || response.user.tipo === 'aux')
                    this.$router.push({ name: 'alunos' });
                else if(response.user.tipo === 'aluno')
                    this.$router.push({ name: 'detalheAluno', params: { alunoId: response.user.id }});
            }).catch(() => {
                this.loader.login = false;
            });
        }
    }
}
</script>

<style lang="stylus" scoped>

>>>.input-login:not(.text-negative)::before {
    color: #52ae41!important;
}

>>>.text-primary {
    color: #52ae41 !important;
}

>>>.input-login {
    input {
        color: #fae906;
    }
}

>>>.input-login:not(.text-negative) {
    .q-if-label {
        color: #52ae41!important;
    }
}

>>>.q-field-bottom {
    font-size: 12px !important;
    padding-top: 8px !important;
}

.card-login {
    border-radius: 5px;
    background: #000000c2;
}

.background-login {
    background: url(https://zelda.com.br/material/noticias_zelda-u-noite-by-e1662.jpg);
    height: 100vh;
    width: 100vw;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
