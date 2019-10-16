import V from '../../../main'
export default function(parmars){
    return new Promise((resolve,reject)=>{
        V.$api.post('/institution/sendVerifyCode', parmars, res => {
            resolve(res)
        })
    }) 
}