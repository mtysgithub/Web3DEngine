function initExt(extPanelManager, oakEngineManager) {
    //已弃用 by _mTy 2013.3.25
}

function refereshExtCamInfo() {
    if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity &&
        (global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oMoveCamObj.m_bChangeCamOld !=
            global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oMoveCamObj.m_bChangeCamNew)) {
        global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oMoveCamObj.m_bChangeCamNew =
            global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oMoveCamObj.m_bChangeCamOld;

        var cam = global_oakEngineManager.getMainEngineObject().m_camActivityCam;
        var eyePos = cam.getPos();

        Ext.get('id_eye_world').update('<' + eyePos.x.toString().substr(0, 5) + ','
            + eyePos.y.toString().substr(0, 5) + ','
            + eyePos.z.toString().substr(0, 5) + '>'
        );

        var forwardDir = cam.getForwardDir();
        Ext.get('id_to_world').update('<' + forwardDir.x.toString().substr(0, 5) + ','
            + forwardDir.y.toString().substr(0, 5) + ','
            + forwardDir.z.toString().substr(0, 5) + '>'
        );

        var upDir = cam.getUpDir();
        Ext.get('id_up_world').update('<' + upDir.x.toString().substr(0, 5) + ','
            + upDir.y.toString().substr(0, 5) + ','
            + upDir.z.toString().substr(0, 5) + '>'
        );
    }
}

function getClientSize() {

    var scrW, scrH;
    if (window.innerHeight && window.scrollMaxY) {
        // Mozilla
        scrW = window.innerWidth + window.scrollMaxX;
        scrH = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
        // all but IE Mac
        scrW = document.body.scrollWidth;
        scrH = document.body.scrollHeight;
    } else if (document.body) { // IE Mac
        scrW = document.body.offsetWidth;
        scrH = document.body.offsetHeight;
    }

    var winW, winH;
    if (window.innerHeight) { // all except IE
        winW = window.innerWidth;
        winH = window.innerHeight;
    } else if (document.documentElement
        && document.documentElement.clientHeight) {
        // IE 6 Strict Mode
        winW = document.documentElement.clientWidth;
        winH = document.documentElement.clientHeight;
    } else if (document.body) { // other
        winW = document.body.clientWidth;
        winH = document.body.clientHeight;
    }

    // for small pages with total size less then the viewport
    var pageW = (scrW < winW) ? winW : scrW;
    var pageH = (scrH < winH) ? winH : scrH;

    return new okVec2(winW, winH);
}



