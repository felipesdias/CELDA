import { SessionStorage } from 'quasar'

const verifica = (tipos) => {
    if(!tipos) return true;
    
    const user = SessionStorage.get.item('user');

    if(user && user.tipo) {
        return tipos.split(',').includes(user.tipo);
    }

    return false;
}

export default ({ Vue }) => {

    Vue.prototype.$can = verifica;
}

export { verifica }
