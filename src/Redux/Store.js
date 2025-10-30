
import { configureStore } from '@reduxjs/toolkit'

import authSliceReducer from "./Slices/authslice.js"

const store=configureStore({
    reducer:{

        auth:authSliceReducer,

    },
    // jab hum deploy karenge tab alag tarah semanage karenge devtools ko
    devTools:true
})
// console.log("store=",store)
/* store Object
@@observable
: 
ƒ [d]()
dispatch
: 
(...a)=> {…}
getState
: 
ƒ i()
liftedStore
: 
{dispatch: ƒ, subscribe: ƒ, getState: ƒ, replaceReducer: ƒ, @@observable: ƒ}
replaceReducer
: 
ƒ replaceReducer(c)
subscribe
: 
ƒ subscribe(listener2)
[[Prototype]]
: 
Object
*/
export default store;
