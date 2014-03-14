function initApplication() {

    global_extPanelManager = new ExtPanelManager();
    global_oakEngineManager = new oakEngineManager();

    Ext.application({
        name:'EngineApplication',
        launch:initAppCallBack
    });

    window.onresize = function () {

        //alert('窗口重置功能已禁用');
        /*
         var winSizeVec = getClientSize();
         var oak_mainEngineObj = global_oakEngineManager.getMainEngineObject();
         var ext_mainWindowObj = global_extPanelManager.getMainWindowObj();

         var mainCanvas = canvas_mainCanvas;
         mainCanvas.width = document.getElementById('ExtMainCanvas').offsetWidth;
         mainCanvas.height = document.getElementById('ExtMainCanvas').offsetHeight;

         if(null != oak_mainEngineObj && true == oak_mainEngineObj.mainLoopActivity){

         if(null != currentActivityCam){

         var currentActivityCam = oak_mainEngineObj.m_camActivityCam;
         currentActivityCam.setViewport(0,0,mainCanvas.width,mainCanvas.height);
         }
         }
         */
    }
}

function initAppCallBack(){
    var extPanelManager = global_extPanelManager;
    var oakEngineManager = global_oakEngineManager;
    var winSizeVec = getClientSize();
    var mainWinGui = Ext.create('Mty.view.ControlMainWindow',
        {
            width:winSizeVec.x,
            height:winSizeVec.y,
            renderTo:Ext.getBody(),
            id:'id_controlMainWindow'
        });

    var mainCanvasDiv = [
        {
            x:0,
            y:0,
            xtype:'panel',
            height:winSizeVec.y - 75 - 10,
            id:'ExtMainCanvas',
            width:winSizeVec.x,
            preventHeader:true,
            title:'工作区',
            layout:{
                type:'absolute'
            }
        }
    ]

    mainWinGui.add(mainCanvasDiv);

    var mainPanelObj = new ExtMainPanelObject({i_mainCanvasWidth:global_mainCanvasWidth, i_mainCanvasHeight:global_mainCanvasHeight});
    global_extPanelManager.setMainWindowObj(mainPanelObj);
    global_extPanelManager.getMainWindowObj().set_pannelMainWindow(mainWinGui);
    global_extPanelManager.getMainWindowObj().initHtmlMainCanvasDiv();
    global_extPanelManager.getMainWindowObj().init();

    createMainEngine(oakEngineManager);
    var mainEngineObj = oakEngineManager.getMainEngineObject();
    //..insert canvas parent
    connect_MainEngine2MainPanel(mainPanelObj, mainEngineObj);

    //渲染服务层插件启动
    oakEngineManager.initPlugin();

    //交互层插件启动
    global_extPanelManager.initPlugin();

}

function connect_MainEngine2MainPanel(mainWindow, mainEngine) {

    var engineSetting = new okEngineSetting();
    engineSetting.antialias = true;
    engineSetting.canvas = mainWindow.getMainCanvas();
    var v_oakEngineInitSuccessful = mainEngine.init(engineSetting);

    if (false == v_oakEngineInitSuccessful) {

        alert('oakEngine加载失败，脚本崩溃性错误');
        return;
    }

    engineSetting.canvas.onmousedown = event_mainCanvasOnMouseDown;
    engineSetting.canvas.onmouseup = event_mainCanvasOnMouseUp;
    engineSetting.canvas.onmousemove = event_mainCanvasOnMouseMove;
    engineSetting.canvas.onkeydown = event_mainCanvasOnKeyDown;
    engineSetting.canvas.onkeyup = event_mainCanvasOnKeyUp;
    document.onkeypress = event_mainCanvasOnKeyPress;
    document.onkeydown = event_mainCanvasOnKeyDown;
    document.onkeyup = event_mainCanvasOnKeyUp;

    mainWindow.showEngineInitProgressBar();
}

function event_createNewWorld() {
    //createNewWorld(global_oakEngineManager.getMainEngineObject().getInitWorldConfData());
    //global_extPanelManager.m_oRenderConfPlugin.addCurScene2UiItem();

    global_extPanelManager.getMainWindowObj().m_oCrtNewProj.setMenuShow();
}

function event_mainCanvasOnKeyPress(event) {
    if (okIsIE()) {
        event = window.event;
    }
    if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
        mainCanvasKeyBoardPressFunc(event);
    }
}

function event_mainCanvasOnKeyDown(event) {
    if (okIsIE()) {
        event = window.event;
    }
    //alert('down: ' + event.keyCode);
    if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
        mainCanvasKeyBoardDownFunc(event);
    }
}

function event_mainCanvasOnKeyUp(event) {
    if (okIsIE()) {
        event = window.event;
    }
    //alert('up: ' + event.keyCode);
    if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
        mainCanvasKeyBoardUpFunc(event);
    }
}

function event_mainCanvasOnMouseDown(event) {
    if (okIsIE()) {
        event = window.event;
    }
    //alert(event.clientX + ' ' + (event.clientY - 58));
    if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
        mainCanvasOnMouseDown(event.clientX - 7, event.clientY - 58);
    }
}

function event_mainCanvasOnMouseUp(event) {
    if (okIsIE()) {
        event = window.event;
    }
    if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
        mainCanvasOnMouseUp(event.clientX - 7, event.clientY - 58);
    }
}

function event_mainCanvasOnMouseMove(event) {
    if (okIsIE()) {
        event = window.event;
    }
    if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
        mainCanvasOnMouseMove(event.clientX - 7, event.clientY - 58);
    }

}