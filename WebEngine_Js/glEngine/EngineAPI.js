function createMainEngine(oakEngineManager) {
    oakEngineManager.setMainEngineObject(new MainEngineObject());
}

function createNewWorld(conf) {

    var oak_mainEngineObj = global_oakEngineManager.getMainEngineObject();
    var canvas = global_extPanelManager.getMainWindowObj().getMainCanvas();

    if (null == oak_mainEngineObj.m_scenSceneList) {
        oak_mainEngineObj.m_scenSceneList = new Array();
    } else {
        // .. 场景非空 提示保存
        Ext.Array.clean(oak_mainEngineObj.m_scenSceneList);
    }

    /********************* 参数化场景参数********************************/
    var strCurSceneName;
    if(null == conf.m_strProjName || undefined == conf.m_strProjName)
        strCurSceneName = 'scene_' + (global_sceneCount++).toString();
    else
        strCurSceneName = conf.m_strProjName;

    oak_mainEngineObj.m_scenActivityScene = oak_mainEngineObj.m_mgrSceneManager.createScene(strCurSceneName);
    oak_mainEngineObj.m_scenSceneList.push(oak_mainEngineObj.m_scenActivityScene);

    var scene = oak_mainEngineObj.m_scenActivityScene;

    //scene.setBaseUrl(conf.m_strBaseUrl);
    scene.setModelUrl(conf.m_strModelUrl); //setup the model resource url
    scene.setTextureUrl(conf.m_strTextureUrl); //setup the texture resource url
    scene.setSkAnimationUrl(conf.m_strSkAnimationUrl);
    scene.setZoneBoundingBox(conf.m_vBBox[0], conf.m_vBBox[1]);

    var camConf = conf.m_oIniCamConf;
    oak_mainEngineObj.m_camActivityCam = scene.createCamera(camConf.m_strCamName);
    oak_mainEngineObj.m_camActivityCam.setViewport(0, 0, canvas.width, canvas.height);
    oak_mainEngineObj.m_camActivityCam.setBackColor(camConf.m_vCamBackGroundColor.x,
        camConf.m_vCamBackGroundColor.y,
        camConf.m_vCamBackGroundColor.z,
        camConf.m_vCamBackGroundColor.w);

    oak_mainEngineObj.m_camActivityCam.setProjMode(camConf.m_enumProjMode);

    if (OAK.PROJMODE_PERSPECTIVE == camConf.m_enumProjMode) {
        //透视投影
        oak_mainEngineObj.m_camActivityCam.setFov(camConf.m_fCamFov);
        oak_mainEngineObj.m_camActivityCam.setVisibleRange(camConf.m_vVisbleRange.x, camConf.m_vVisbleRange.y);
        oak_mainEngineObj.m_camActivityCam.setPos(camConf.m_vCamPos.x, camConf.m_vCamPos.y, camConf.m_vCamPos.z);
        oak_mainEngineObj.m_camActivityCam.lookAt(camConf.m_vCamLookat.x, camConf.m_vCamLookat.y, camConf.m_vCamLookat.z,
            camConf.m_vCamLookUp.x, camConf.m_vCamLookUp.y, camConf.m_vCamLookUp.z);
    } else {
        //正交投影
    }

    /***************************** 绘制基本场景参考物  ********************/
    drawGroundGird(conf);
    drawWorldCoord();

    /*
    var loopDrawFunc = drawWorldCoordOnCanvas();
    global_renderFuncArr.push(new Array(this, loopDrawFunc));
    */

    /* test */
    testDraw(conf);

    if (false == oak_mainEngineObj.mainLoopActivity) {
        oak_mainEngineObj.mainLoopActivity = true;
        oak_mainEngineObj.startMainEngineLoop();
    }
}

function drawWorldCoordOnCanvas() {
    var oak_mainEngineObj = global_oakEngineManager.getMainEngineObject();
    var scene = oak_mainEngineObj.m_scenActivityScene;

    var drawEntiX = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'worldCoordOnCanvas_X');
    drawEntiX.setName('worldCoordOnCanvas_X');

    drawEntiX.createAttribute('Position', 2 * 3, null, OAK.STATIC_DRAW);
    drawEntiX.createIndex('worldCoordOnCanvas_X_index', 1 * 2, null, OAK.STATIC_DRAW, OAK.LINES);

    drawEntiX.getMaterial().setEmissive(1.0, 0, 0);
    drawEntiX.getMaterial().setDiffuse(0, 0, 0);
    drawEntiX.getMaterial().enableDynamicLighting(false);

    var drawEntiY = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'worldCoordOnCanvas_Y');
    drawEntiY.setName('worldCoordOnCanvas_Y');

    drawEntiY.createAttribute('Position', 2 * 3, null, OAK.STATIC_DRAW);
    drawEntiY.createIndex('worldCoordOnCanvas_Y_index', 1 * 2, null, OAK.STATIC_DRAW, OAK.LINES);

    drawEntiY.getMaterial().setEmissive(0, 1.0, 0);
    drawEntiY.getMaterial().setDiffuse(0, 0, 0);
    drawEntiY.getMaterial().enableDynamicLighting(false);

    var drawEntiZ = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'worldCoordOnCanvas_Z');
    drawEntiZ.setName('worldCoordOnCanvas_Z');

    drawEntiZ.createAttribute('Position', 2 * 3, null, OAK.STATIC_DRAW);
    drawEntiZ.createIndex('worldCoordOnCanvas_Z_index', 1 * 2, null, OAK.STATIC_DRAW, OAK.LINES);

    drawEntiZ.getMaterial().setEmissive(0, 0, 1.0);
    drawEntiZ.getMaterial().setDiffuse(0, 0, 0);
    drawEntiZ.getMaterial().enableDynamicLighting(false);

    return function () {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var scene = mainEngineObj.m_scenActivityScene;
        var cam = mainEngineObj.m_camActivityCam;
        /*
         var fFaraway = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_vVisbleRange.x + 1;
         var vecLook = okVec3MulVal((cam.getForwardDir().normalize()), fFaraway);

         var tCnt = (mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_vVisbleRange.x *
         Math.tan(((cam.getFov() / 2) * Math.PI) / 180));
         //alert(tCnt);

         var vecRight = okVec3MulVal((cam.getRightDir().normalize()), -1 * tCnt);
         var vecUp = okVec3MulVal(cam.getUpDir().normalize(), -1 * tCnt);

         var vDrwTarget = okVec3Add(cam.getPos(), okVec3Add(vecLook, okVec3Add(vecRight, vecUp)));
         var vTargetPos = vDrwTarget;
         */
        var clientSize = getClientSize();
        var moveVec = cam.getPickPoint(clientSize.x / 2, clientSize.y / 10);
        var vTargetPos = moveVec;
        vTargetPos = okVec3Add(vTargetPos, cam.getForwardDir().normalize());
        //alert(vTargetPos.x + ' ' + vTargetPos.y + ' ' + vTargetPos.z);

        var coordEntiX = drawEntiX;
        var coordEntiY = drawEntiY;
        var coordEntiZ = drawEntiZ;

        var posIndex = [0, 1];
        var posArrX = [vTargetPos.x + 0.1, vTargetPos.y, vTargetPos.z,
            vTargetPos.x, vTargetPos.y, vTargetPos.z];

        var posArrY = [vTargetPos.x, vTargetPos.y + 0.1, vTargetPos.z,
            vTargetPos.x, vTargetPos.y, vTargetPos.z];

        var posArrZ = [vTargetPos.x, vTargetPos.y, vTargetPos.z + 0.1,
            vTargetPos.x, vTargetPos.y, vTargetPos.z];

        coordEntiX.loadAttribute('Position', 0, posArrX.length, posArrX);
        coordEntiX.loadIndex('worldCoordOnCanvas_X_index', 0, posIndex.length, posIndex);
        coordEntiX.setActiveIndex('worldCoordOnCanvas_X_index', OAK.LINES, 0, posIndex.length);

        coordEntiY.loadAttribute('Position', 0, posArrY.length, posArrY);
        coordEntiY.loadIndex('worldCoordOnCanvas_Y_index', 0, posIndex.length, posIndex);
        coordEntiY.setActiveIndex('worldCoordOnCanvas_Y_index', OAK.LINES, 0, posIndex.length);

        coordEntiZ.loadAttribute('Position', 0, posArrZ.length, posArrZ);
        coordEntiZ.loadIndex('worldCoordOnCanvas_Z_index', 0, posIndex.length, posIndex);
        coordEntiZ.setActiveIndex('worldCoordOnCanvas_Z_index', OAK.LINES, 0, posIndex.length);
    }
}

function drawWorldCoord() {
    var oak_mainEngineObj = global_oakEngineManager.getMainEngineObject();
    var scene = oak_mainEngineObj.m_scenActivityScene;

    var worldCoordMeshX = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'world_coord_X');
    worldCoordMeshX.setName('world_coord_X');
    worldCoordMeshX.enableVisible(false);
    worldCoordMeshX.createAttribute('Position', 2 * 3, null, OAK.STATIC_DRAW);
    worldCoordMeshX.createIndex('world_coord_X_index', 1 * 2, null, OAK.STATIC_DRAW, OAK.LINES);
    var xCoordPoiArr = [-200, 0, 0,
        200, 0, 0];
    var xCoordPoiIndexArr = [0, 1];
    worldCoordMeshX.loadAttribute('Position', 0, xCoordPoiArr.length, xCoordPoiArr);
    worldCoordMeshX.loadIndex('world_coord_X_index', 0, xCoordPoiIndexArr.length, xCoordPoiIndexArr);
    worldCoordMeshX.setActiveIndex('world_coord_X_index', OAK.LINES, 0, xCoordPoiIndexArr.length)
    worldCoordMeshX.getMaterial().setEmissive(1.0, 0, 0);
    worldCoordMeshX.getMaterial().setDiffuse(0, 0, 0);
    worldCoordMeshX.getMaterial().enableDynamicLighting(false);
    worldCoordMeshX.enableVisible(true);

    var worldCoordMeshY = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'world_coord_Y');
    worldCoordMeshY.setName('world_coord_Y');
    worldCoordMeshY.enableVisible(false);
    worldCoordMeshY.createAttribute('Position', 2 * 3, null, OAK.STATIC_DRAW);
    worldCoordMeshY.createIndex('world_coord_Y_index', 1 * 2, null, OAK.STATIC_DRAW, OAK.LINES);
    var yCoordPoiArr = [0, -200, 0,
        0, 200, 0];
    var yCoordPoiIndexArr = [0, 1];
    worldCoordMeshY.loadAttribute('Position', 0, yCoordPoiArr.length, yCoordPoiArr);
    worldCoordMeshY.loadIndex('world_coord_Y_index', 0, yCoordPoiIndexArr.length, yCoordPoiIndexArr);
    worldCoordMeshY.setActiveIndex('world_coord_Y_index', OAK.LINES, 0, yCoordPoiIndexArr.length)
    worldCoordMeshY.getMaterial().setEmissive(0, 1.0, 0);
    worldCoordMeshY.getMaterial().setDiffuse(0, 0, 0);
    worldCoordMeshY.getMaterial().enableDynamicLighting(false);
    worldCoordMeshY.enableVisible(true);

    var worldCoordMeshZ = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'world_coord_Z');
    worldCoordMeshZ.setName('world_coord_Z');
    worldCoordMeshZ.enableVisible(false);
    worldCoordMeshZ.createAttribute('Position', 2 * 3, null, OAK.STATIC_DRAW);
    worldCoordMeshZ.createIndex('world_coord_Z_index', 1 * 2, null, OAK.STATIC_DRAW, OAK.LINES);
    var zCoordPoiArr = [0, 0, -200,
        0, 0, 200];
    var zCoordPoiIndexArr = [0, 1];
    worldCoordMeshZ.loadAttribute('Position', 0, zCoordPoiArr.length, zCoordPoiArr);
    worldCoordMeshZ.loadIndex('world_coord_Z_index', 0, zCoordPoiIndexArr.length, zCoordPoiIndexArr);
    worldCoordMeshZ.setActiveIndex('world_coord_Z_index', OAK.LINES, 0, zCoordPoiIndexArr.length)
    worldCoordMeshZ.getMaterial().setEmissive(0, 0, 1.0);
    worldCoordMeshZ.getMaterial().setDiffuse(0, 0, 0);
    worldCoordMeshZ.getMaterial().enableDynamicLighting(false);
    worldCoordMeshZ.enableVisible(true);
}

function drawGroundGird(conf) {
    var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
    var camConf = conf.m_oIniCamConf;
    var grdEntiMesh = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'BaseStandGroundMesh');
    grdEntiMesh.setName('BaseStandGroundMesh');
    grdEntiMesh.createAttribute('Position', 84 * 3, null, OAK.STATIC_DRAW);
    grdEntiMesh.createIndex('grdIndex', 42 * 2, null, OAK.STATIC_DRAW, OAK.LINES);

    grdEntiMesh.getMaterial().setEmissive(1 - camConf.m_vCamBackGroundColor.x,
        1 - camConf.m_vCamBackGroundColor.y,
        1 - camConf.m_vCamBackGroundColor.z);

    grdEntiMesh.getMaterial().setDiffuse(0, 0, 0);
    grdEntiMesh.getMaterial().enableDynamicLighting(false);

    var grdPosArr = new Array();
    var grdPosX = -100;
    for (var i = 0; i < 21; ++i) {
        grdPosArr.push(grdPosX, 0, -100);
        grdPosArr.push(grdPosX, 0, 100);
        grdPosX += 10;
    }
    var grdPosZ = -100;
    for (var i = 0; i < 21; ++i) {
        grdPosArr.push(-100, 0, grdPosZ);
        grdPosArr.push(100, 0, grdPosZ);
        grdPosZ += 10;
    }
    var grdPoiIndexArr = new Array();
    for (var i = 0; i < 84; ++i) {
        grdPoiIndexArr.push(i);
    }
    grdEntiMesh.loadAttribute("Position", 0, grdPosArr.length, grdPosArr);
    grdEntiMesh.loadIndex("grdIndex", 0, grdPoiIndexArr.length, grdPoiIndexArr);
    grdEntiMesh.setActiveIndex('grdIndex', OAK.LINES, 0, grdPoiIndexArr.length);
    grdEntiMesh.enableVisible(true);
}

function mainCanvasOnMouseDown(x, y) {
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_vCurMousePos = new okVec2(x, y);
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_bTipMainCanvas = true;

    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.mouseDown();

    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_vLastTipMainCanvas = new okVec2(x, y);
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_vLastMoveMainCanvas = new okVec2(x, y);
}

function mainCanvasOnMouseUp(x, y) {
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_vCurMousePos = new okVec2(x, y);
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_bTipMainCanvas = false;
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.mouseUp();
}

function mainCanvasOnMouseMove(x, y) {
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_vCurMousePos = new okVec2(x, y);
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.mouseMove();
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_vLastMoveMainCanvas = new okVec2(x, y);
}

function mainCanvasKeyBoardPressFunc(event) {
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.keyBoardPressFunc(event);
}

function mainCanvasKeyBoardUpFunc(event) {
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_bHavePresKey = false;
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oKeybordHash[event.keyCode] = false;
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.keyBoardUpFunc(event);
}

function mainCanvasKeyBoardDownFunc(event) {
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_bHavePresKey = true;
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oKeybordHash[event.keyCode] = true;
    global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.keyBoardDownFunc(event);
}

function global_renderUpdata() {
    for (var i = 0; i < global_renderFuncArr.length; ++i) {
        global_renderFuncArr[i][1].call(global_renderFuncArr[i][0]);
    }
}

/************************************************************/
//test

function testDraw(conf) {
    var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
    /*************************    test   ********************************************/
    //add static entities to scene
    /*
     var entity = scene.createEntity(OAK.ETYPE_DYNAMIC, "AppleLogo");
     var bIsLoaded = entity.loadModel("AppleLogo.xml");
     if (true == bIsLoaded) {
     entity.setPos(entity.getBoundingSphereCenter().neg());
     //entity.scale(OAK.SPACE_WORLD, 1 / entity.getBoundingSphereRadius());
     global_renderFuncArr.push(new Array(this, rotateApple));
     }
     */
    //add a directional light to scene
    var dctLight = scene.createEntity(OAK.ETYPE_DCT_LIGHT, "DctLight");
    //dctLight.setLightDir(-0.5, -1.0, -0.5);
    dctLight.setColor(1.0, 1.0, 1.0);
    global_renderFuncArr.push(new Array(this, updataLightDir));
    global_renderFuncArr.push(new Array(this, refereshExtCamInfo));

    /*
    var girdMesh = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, 'ball');
    girdMesh.setPos(0,0,0);
    girdMesh = okGenBoxMesh(girdMesh.getMesh(), new okVec3(-1, -1, -1), new okVec3(1, 1, 1), false);
    girdMesh.getMaterial().setAmbient(1, 0, 0);
    girdMesh.getMaterial().setDiffuse(1, 0, 0);
    */
    /*****************************************************************************************/
}

function rotateApple() {
    var vMainEngineObj = global_oakEngineManager.getMainEngineObject();
    vMainEngineObj.m_mgrSceneManager.getScene('main_world').getEntity('AppleLogo').rotY(OAK.SPACE_LOCAL, 1);
}

function updataLightDir() {
    var cam = global_oakEngineManager.getMainEngineObject().m_camActivityCam;
    var forwarDir = cam.getForwardDir();
    //dctLight.setLightDir(forwarDir.x,forwarDir.y,forwarDir.z);
    var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
    var dctLight = scene.getEntity('DctLight');
    dctLight.setLightDir(-0.5, -0.5, -0.5);
}