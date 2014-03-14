function CoreEntiMgrObj() {
    this.m_oEntiTreeOpr = null; //对象树操作的算法类
    this.m_oLocalModelIO = null; //模型对象解析类
    this.init = function () {
        this.m_oEntiTreeOpr = new EntiTreeOprObj();
        this.m_oEntiTreeOpr.init();

        this.m_oLocalModelIO = new LocalModel_IOObj();
        this.m_oLocalModelIO.init();
    }
}

function LocalModel_IOObj() {
    this.m_oDomParser = null;
    this.m_strEntiPreName = null;
    this.m_strEntiName = null;
    this.init = function () {
        this.m_strEntiPreName = "";
        this.m_strEntiName = "";

        this.m_oDomParser = new DOMParser();
    }
    this.addModel = function (scene, fileName, fileContent) {
        // create entity
        var entiName = "";
        //fileName.replace(/./g,"_");
        if ("" != this.m_strEntiName) {
            entiName = this.m_strEntiName;
        }
        var model = scene.createEntity(OAK.ETYPE_DYNAMIC, entiName);
        model.loadModel(fileName, fileContent);
        model.setPos(0, 0, 0);
        for (var sMeshName in model.getMaterialMap()) {
            var mtrl = model.getMaterial(sMeshName);
            mtrl.enableTwoSide(true);
        }
        if ("" == this.m_strEntiPreName) {
            //没有指定父实体
            return;
        }
        var preEntiName = this.m_strEntiPreName;
        var preEntiArr = new Array();
        scene.getEntityArray(preEntiArr, OAK.ETYPE_ALL, function (e) {
            var entiName = e.getName();
            return (preEntiName == entiName);
        });
        if (1 != preEntiArr.length) {
            //实体不唯一
            return;
        }
        //binding
        preEntiArr[0].attachChild(model);
    }
    this.parseModel = function (file) {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var mgrPlugin = global_oakEngineManager.m_oEntiMgrPlugin.m_oLocalModelIO;
            var xmlStr = e.target.result;
            var header = xmlStr.substring(0, 6);
            if (header != "OKMDBI") {
                var start = xmlStr.indexOf("<");
                var end = xmlStr.lastIndexOf(">");
                xmlStr = xmlStr.substr(start, end - start + 1);
                var xmlDoc = mgrPlugin.m_oDomParser.parseFromString(xmlStr, 'text/xml');
                if (xmlDoc.documentElement.tagName != "Oak3DModelDocument") {
                    alert("This is not a Oak3D model file!");
                    return;
                }
            }
            mgrPlugin.addModel(global_oakEngineManager.getMainEngineObject().m_scenActivityScene,
                file.name, xmlStr);

            //压入Ajax模块，保存时发送
            global_extPanelManager.m_oNetWorkPlugin.insertModel(global_oakEngineManager.getMainEngineObject().m_scenActivityScene.getName(),
                file.name, xmlStr);

            //thisViewer.modelRender.loadModel(file.name, xmlStr);
            //thisViewer.animationSelectButton.disabled = "";
        }
        fileReader.readAsBinaryString(file);
    }
}

function CoreRenderConfObj() {
    this.init = function () {

    }
    this._setFogEnable_ = function (fogIndx, e) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var renderer = mainEngineObj.m_enOakEngine.getRenderer();
        renderer.enableFog(fogIndx, e);
    }
    /*--- 雾化插件 ---*/
    this._setFogColor_ = function (fogIndx, r, g, b) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var renderer = mainEngineObj.m_enOakEngine.getRenderer();
        if (true == renderer.isFogEnabled(fogIndx)) {
            renderer.setFogColor(fogIndx, r, g, b);
        }
    }
    this._setFogDensity_ = function (fogIndx, density) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var renderer = mainEngineObj.m_enOakEngine.getRenderer();
        renderer.setFogDensity(fogIndx, density);
    }
    this._setFogDistanceFar_ = function (fogIndx, dist) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var renderer = mainEngineObj.m_enOakEngine.getRenderer();
        renderer.setFogDistanceFar(fogIndx, dist);
    }
    this._setFogDistanceNear_ = function (fogIndx, dist) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var renderer = mainEngineObj.m_enOakEngine.getRenderer();
        renderer.setFogDistanceNear(fogIndx, dist);
        //setFogDistanceNear
    }
    /*--- 相机插件 ---*/
    this._setFov_ = function (fov) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var curCam = mainEngineObj.m_camActivityCam;
        curCam.setFov(fov);
    }
    this._setBackColor_ = function (dir) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var curCam = mainEngineObj.m_camActivityCam;
        // okVec4
        curCam.setBackColor(dir.x, dir.y, dir.z, dir.w);
    }
}

function EntiTreeOprObj() {
    this.init = function () {

    }
}

function UnCoreDrawMgrObj() {
    this.m_oReferInfoDraw = null;
    this.init = function () {
        //参考物绘制类
        this.m_oReferInfoDraw = new ReferenceInfoDrawObj();
        this.m_oReferInfoDraw.init();
    }
}

function ReferenceInfoDrawObj() {
    this.m_oBoundingBoxDraw = null;
    this.init = function () {
        this.m_oBoundingBoxDraw = new BoundBoxDrawObj();
        this.m_oBoundingBoxDraw.init();
    }
}

function BoundBoxDrawObj() {
    this.m_oBoundingBoxMap = null;
    this.m_bShowAll = null;
    this.init = function () {
        this.m_oBoundingBoxMap = new HashMap();
        this.m_bShowAll = true;
        if (null == global_renderFuncArr || undefined == global_renderFuncArr) {
            //mainEngineObj主框架服务应该率先启动，并配置渲染任务循环序列
            alert('崩溃: 循环序列容器global_renderFuncArr is null !');
            return;
        }
        global_renderFuncArr.push(new Array(this, this.updateBoxDraw)); //压入循环更新容器
    }
    this.addEntiBox = function (entiName) {
        this.__createBox(entiName);
    }
    this.delEntiBox = function (entiName) {
        //var curBox = this.m_oBoundingBoxMap.get(entiName);
        this.setBoxVisible(entiName, false);
        this.m_oBoundingBoxMap.remove(entiName);
    }
    this.setBoxVisible = function (entiName, bIsShow) {
        var curBBox = this.m_oBoundingBoxMap.get(entiName);
        curBBox.enableVisible(bIsShow);
    }
    this.__createBox = function (strEntiName) {
        //create a custom mesh entity for drawing bounding box
        var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
        var findBox = scene.getEntity("BoundingBox_" + strEntiName);
        if (!(undefined == findBox || null == findBox)) {
            this.m_oBoundingBoxMap.put(strEntiName, findBox);
            this.setBoxVisible(strEntiName, false);
            return;
        }
        var newBox = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, "BoundingBox_" + strEntiName);
        newBox.setName("BoundingBox_" + strEntiName);
        newBox.createAttribute("Position", 8 * 3, null, OAK.DYNAMIC_DRAW);
        newBox.createIndex("Wireframe", 12 * 2, null, OAK.DYNAMIC_DRAW, OAK.LINES);
        newBox.getMaterial().setEmissive(1.0, 1.0, 0.0);
        newBox.getMaterial().setDiffuse(0, 0, 0);
        newBox.getMaterial().enableDynamicLighting(false);

        this.m_oBoundingBoxMap.put(strEntiName, newBox); //插入映射容器
        this.setBoxVisible(strEntiName, false);
    }
    this.__drawBox2Enti = function (strEntiName) {
        var oprObj = global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oEntiOperaObj;
        var curEnti = oprObj.getSletedEnti(strEntiName);
        if (null == curEnti || undefined == curEnti) {
            //alert("为实体绘制包围盒时失败：未找到实体！");
            return;
        }
        var curBBox_virtual = curEnti.getBoundingBox();
        var vMin = curBBox_virtual.getMin();
        var vMax = curBBox_virtual.getMax();

        var aPosArray = [vMin.x, vMin.y, vMin.z,
            vMax.x, vMin.y, vMin.z,
            vMax.x, vMax.y, vMin.z,
            vMin.x, vMax.y, vMin.z,
            vMin.x, vMin.y, vMax.z,
            vMax.x, vMin.y, vMax.z,
            vMax.x, vMax.y, vMax.z,
            vMin.x, vMax.y, vMax.z];

        var aIndexArray = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
        var curBBox = this.m_oBoundingBoxMap.get(strEntiName);
        if (undefined == curBBox || null == curBBox) {
            //alert("尝试绘制包围盒时错误，找不到实体");
            return;
        }
        curBBox.loadAttribute("Position", 0, aPosArray.length, aPosArray);
        curBBox.loadIndex("Wireframe", 0, aIndexArray.length, aIndexArray);
        curBBox.setActiveIndex("Wireframe", OAK.LINES, 0, aIndexArray.length);
        this.setBoxVisible(strEntiName, this.m_bShowAll);

    }
    this.updateBoxDraw = function () {
        //return ;
        var oprObj = global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oEntiOperaObj;
        var entiSet = oprObj.getSletedEntis();
        if (null == entiSet || undefined == entiSet) {
            //alert("为实体绘制包围盒时失败：未找到实体！");
            return;
        }
        for (var iSetIndx = 0; iSetIndx < entiSet.length; ++iSetIndx) {
            this.__drawBox2Enti(entiSet[iSetIndx].getName());
        }
    }
    this.clearAll = function () {
        var boxNameSet = this.m_oBoundingBoxMap.keySet();
        if (null == boxNameSet || undefined == boxNameSet) {
            return;
        }
        for (var iBoxNameIndx = 0; iBoxNameIndx < boxNameSet.length; ++iBoxNameIndx) {
            this.delEntiBox(boxNameSet[iBoxNameIndx]);
        }
    }
}
