import router from './index'

router.beforeEach((to, from, next) => {
    const whiteList = ['/login'] // 白名单
    let admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) { 
        next();
    } else {
        if (whiteList.includes(to.path)) {
            next();
        } else {
            next("/login");
        }
    }
})