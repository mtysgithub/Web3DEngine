function ExtPanelManager() {

    this.v_extMainPanelObj = null;
    this.m_oAboutPanelObj = null;

    // 插件化
    this.m_oEntiLocalIOPlugin = null;
    this.m_oRenderConfPlugin = null;
    this.m_oBaseModelPlugin = null;
    this.m_oNetWorkPlugin = null; //Ajax通讯处理类

    this.initPlugin = function () {
        this.m_oAboutPanelObj = new ExtAboutPanelObj();
        this.m_oAboutPanelObj.init();

        this.m_oEntiLocalIOPlugin = new ExtEntiLocalIOObj();
        this.m_oEntiLocalIOPlugin.init();

        this.m_oRenderConfPlugin = new ExtRenderConfObj();
        this.m_oRenderConfPlugin.init();

        this.m_oBaseModelPlugin = new ExtBaseModelBuildMenu();
        this.m_oBaseModelPlugin.init();

        this.m_oNetWorkPlugin = new NetWorkObject();
        this.m_oNetWorkPlugin.init();
    }

    this.setMainWindowObj = function (obj) {
        this.v_extMainPanelObj = obj;
    }
    this.getMainWindowObj = function () {
        return this.v_extMainPanelObj;
    }
}

var global_extPanelManager = null;
