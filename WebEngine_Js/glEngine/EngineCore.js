function oakEngineManager() {

    this.v_enMainEngineObjct = null; //主界面功能类
    this.m_oEntiMgrPlugin = null; //编辑对象管理类
    this.m_oRenderConfPlugin = null; //建模环境配置插件
    this.m_oUnCoreDrawMgrPlugin = null; //非外围对象绘制插件

    this.getMainEngineObject = function () {

        return this.v_enMainEngineObjct;
    }
    this.setMainEngineObject = function (obj) {

        this.v_enMainEngineObjct = obj;
    }

    this.initPlugin = function () {

        this.m_oEntiMgrPlugin = new CoreEntiMgrObj();
        this.m_oEntiMgrPlugin.init();

        this.m_oRenderConfPlugin = new CoreRenderConfObj();
        this.m_oRenderConfPlugin.init();

        this.m_oUnCoreDrawMgrPlugin = new UnCoreDrawMgrObj();
        this.m_oUnCoreDrawMgrPlugin.init();
    }
}

var global_oakEngineManager = null;
