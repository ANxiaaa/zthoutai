export default {
    state: {
        navTree: [],  // 导航菜单树
    },
    getters: {

    },
    mutations: {
        setNavTree(state, navTree){  // 设置导航菜单树
            state.navTree = navTree;
        },
        setNavIcon(state, data){
            let {id, icon} = data
            let tree = state.navTree;
            let setIcon = a => {
                a.forEach(i=>{
                    if(i.id === id){
                        i.icon = icon
                    }else if(i.id !== id && i.children.length >= 1){
                        setIcon(i.children)
                    }
                })
            }
            setIcon(tree);
        }
    },
    actions: {

    }
}