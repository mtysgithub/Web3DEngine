function ExtMainPanelObject() {

    this.panel_mainWindow = null;
    this.div_mainCanvasParent = null;
    this.canvas_mainCanvas = null;
    this.i_mainCanvasWidth = null;
    this.i_mainCanvasHeight = null;

    this.m_oCrtNewProj = null;
    this.m_oSletEntiMenuObj = null;
    this.m_oBaseOprMenu = null;

    this.set_pannelMainWindow = function (object) {

        this.panel_mainWindow = object;
    }

    this.getMainCanvasParentDiv = function () {

        return this.div_mainCanvasParent;
    }

    this.initHtmlMainCanvasDiv = function () {

        this.div_mainCanvasParent =
            Ext.core.DomHelper.insertFirst(
                Ext.get("ExtMainCanvas-body"),
                {
                    id:'id_divMainCanvasParent',
                    html:""//"sucessful"
                },
                false
            );
        this.canvas_mainCanvas =
            //alert(document.getElementById('ExtMainCanvas').offsetHeight);
            okGenCanvas(document.getElementById('ExtMainCanvas').offsetWidth,
                document.getElementById('ExtMainCanvas').offsetHeight,
                this.getMainCanvasParentDiv(),
                'main_canvas'
            );

        this.i_mainCanvasWidth = this.canvas_mainCanvas.width;
        this.i_mainCanvasHeight = this.canvas_mainCanvas.height;
    }

    this.getMainCanvas = function () {

        return this.canvas_mainCanvas;
    }

    this.showEngineInitProgressBar = function () {
        Ext.MessageBox.wait(
            '正在加载Engine内核...',
            '提示',
            {
                duration:2075,
                interval:2,
                increment:200,
                text:'waiting...',
                scope:this,
                fn:function () {
                    Ext.MessageBox.alert('提示', '加载动作完成');
                }
            }
        );
    }

    this.init = function () {
        this.i_mainCanvasWidth = 1;
        this.i_mainCanvasHeight = 1;

        this.m_oSletEntiMenuObj = new SletEntiOperaMenuObj();
        this.m_oSletEntiMenuObj.init();

        this.m_oCrtNewProj = new CrtNewWorPanlObj();
        this.m_oCrtNewProj.init();

        this.m_oBaseOprMenu = new BaseOprObj();
        this.m_oBaseOprMenu.init();
    }

    this.sletEntiOperaMenuShow = function (x, y) {
        this.m_oSletEntiMenuObj.hideMenu();
        this.m_oSletEntiMenuObj.resetMenu();
        this.m_oSletEntiMenuObj.showMenu(x, y);
    }

    this.sletEntiOperaMenuHide = function () {
        this.m_oSletEntiMenuObj.hideMenu();
        this.m_oSletEntiMenuObj.resetMenu();
    }
}

function BaseOprObj(){
    this.m_uiPanl = null;
    this.init = function(){
        this.m_uiPanl = Ext.create('Mty.view.BaseOprMenu',{
            renderTo:'id_controlMainWindow-body',
            x:10, y:10});
        this.setMenuHide();
    }
    this.setMenuShow = function () {
        if (null != this.m_uiPanl && undefined != this.m_uiPanl) {
            this.m_uiPanl.show();
        } else {

        }
    }
    this.setMenuHide = function () {
        if (null != this.m_uiPanl && undefined != this.m_uiPanl) {
            this.m_uiPanl.hide();
        }else{

        }
    }
}

function CrtNewWorPanlObj() {
    this.m_uiPanl = null;
    this.m_oConfData = null;
    this.init = function () {
        var xPos = (global_mainCanvasWidth / 2) - (400 / 2);
        var yPos = (global_mainCanvasHeight / 2) - (250 / 2);
        this.m_uiPanl = Ext.create('Mty.view.crtNewProj', {
            renderTo:'id_controlMainWindow-body',
            x:xPos,
            y:yPos
        });
        this.setMenuHide();
        this.m_oConfData = {
            m_strBaseUrl:"media",
            m_strModelUrl:"media/Models",
            m_strTextureUrl:"media/Textures",
            m_strSkAnimationUrl:"media/Animations",

            m_vBBox:new Array(new okVec3(-1000, -1000, -1000), new okVec3(1000, 100, 1000)),
            m_oIniCamConf:{
                m_strCamName:"cam_1",
                m_vCamBackGroundColor:new okVec4(0.0, 0.0, 0.0, 1.0),
                m_enumProjMode:OAK.PROJMODE_PERSPECTIVE,
                m_vVisbleRange:new okVec2(1, 10000),
                m_vCamPos:new okVec3(0, 0, 2),
                m_vCamLookat:new okVec3(0, 0, -1),
                m_vCamLookUp:new okVec3(0, 1, 0),
                m_fCamFov:60.0
            }
        };
    }
    this.setMenuShow = function () {
        if (null != this.m_uiPanl && undefined != this.m_uiPanl) {
            this.m_uiPanl.show();
        } else {

        }
    }
    this.setMenuHide = function () {
        if (null != this.m_uiPanl && undefined != this.m_uiPanl) {
            this.m_uiPanl.hide();
        }
    }
}

function SletEntiOperaMenuObj() {
    this.m_uiMenu = null;
    this.m_strOperaCodec = null;

    this.init = function () {
        // new object
        this.m_uiMenu = Ext.create('Mty.view.sletMenu', {
            renderTo:'id_controlMainWindow-body',
            x:10,
            y:10
        });
        this.m_uiMenu.hide();
        this.m_strOperaCodec = 'NO_OPERA';
    }

    this.resetMenu = function () {
        this.m_strOperaCodec = 'NO_OPERA';
    }

    this.showMenu = function (x, y) {
        this.m_uiMenu.setPosition(x, y);
        this.m_uiMenu.show();
    }

    this.hideMenu = function () {
        this.m_uiMenu.hide();
    }
}