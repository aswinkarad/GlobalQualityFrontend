import axios from 'axios'
export default {
    namespaced: true,
    state: {
        userData: {}
    },
    mutations: {
        SET_USER( state, user){
            localStorage.setItem('user', JSON.stringify(user) )
            state.userData = user
        }
    },
    actions: {
       async USER_LOGIN({ commit, state }, payload){
            const login = await axios({
                method: 'post',
                url: `${process.env.VUE_APP_BASE_URL}auth/sign_in`,
                data:{
                    username: payload.username,
                    password: payload.password
                }
                
            })
            
             commit('SET_USER' ,login.data)
            // console.log(state.userData)
        }
    },
    getters: {
     
    }

}