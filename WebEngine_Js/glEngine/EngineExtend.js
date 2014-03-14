/*
@功能描述：复合对象类，主要用于支撑复选操作
 */
function EntiCompAtom(){

    this.m_oEntiArr = null;
    this.m_vBBbox = null;
    this.m_strName = null;
    this.m_vPos = null;

    /*
    @功能描述: Construct
     */
    this.init = function(entiList,strName){
        this.m_oEntiArr = new HashMap();
        for(var i = 0; i < entiList.length; ++i){
            this.m_oEntiArr.put(entiList[i].getName(),entiList[i]);
        }
        var vMinMaxPoiArr = this.__clacBBoxMinMaxPoi();
        this.m_vBBbox = new okAABBox(vMinMaxPoiArr[0],vMinMaxPoiArr[1]);
        this.m_strName = strName;

        var vCurPos = new okVec3(Math.abs(this.m_vBBbox.getMin().x - this.m_vBBbox.getMax().x) / 2,
            Math.abs(this.m_vBBbox.getMin().y - this.m_vBBbox.getMax().y) / 2,
            Math.abs(this.m_vBBbox.getMin().z - this.m_vBBbox.getMax().z) / 2);
        this.m_vPos = vCurPos;
    }

    this.atoms_init = function(atomList,strName){
        this.m_oEntiArr = new HashMap();
        this.mergeAtomList(atomList,strName);
    }

    /*
    @功能描述: 计算复合结构的BBox
     */
    this.__clacBBoxMinMaxPoi = function(){
        var resArr = new Array(new okVec3(),new okVec3());
        /*
            ...
            最小包围矩形
         */
        var entiArr = this.m_oEntiArr.values();
        resArr[0] = entiArr[0].getBoundingBox().getMin();
        resArr[1] = entiArr[0].getBoundingBox().getMax();
        /*
        @功能描述：判断a向量是否是b的三维空间完全前驱(a.x < b.x & a.y < b.y & a.z < b.z)_
         */
        var vec3CompyMin = function(a,b){
            if(a.x <= b.x &&
                a.y <= b.y &&
                    a.z <= b.z){

                return true;
            }
            return false;
        }
        var firMinVec = entiArr[0].getBoundingBox().getMin();
        var firMaxVec = entiArr[0].getBoundingBox().getMax();
        var minX,minY,minZ;
        var maxX,maxY,maxZ;
        minX = firMinVec.x;
        minY = firMinVec.y;
        minZ = firMinVec.z;
        maxX = firMaxVec.x;
        maxY = firMaxVec.y;
        maxZ = firMaxVec.z;
        for(var i = 1; i < entiArr.length; ++i){
            var curMin = entiArr[i].getBoundingBox().getMin();
            var curMax = entiArr[i].getBoundingBox().getMax();
            /*
            if(true == vec3CompyMin(curMin,resArr[0]) ){
                resArr[0] = curMin;

            }
            if(true == vec3CompyMin(resArr[1],curMax)){
                resArr[1] = curMax;
            }
            */
            minX = (minX >= curMin.x)?(curMin.x):(minX);
            minY = (minY >= curMin.y)?(curMin.y):(minY);
            minZ = (minZ >= curMin.z)?(curMin.z):(minZ);

            maxX = (maxX <= curMax.x)?(curMax.x):(maxX);
            maxY = (maxY <= curMax.y)?(curMax.y):(maxY);
            maxZ = (maxZ <= curMax.z)?(curMax.z):(maxZ);
        }

        resArr[0] = new okVec3(minX,minY,minZ);
        resArr[1] = new okVec3(maxX,maxY,maxZ);
        return resArr;
    }

    /*
    功能描述：刷新计算最小包围盒
     */
    this.refreshBBox = function(){
        var vMinMaxPoiArr = this.__clacBBoxMinMaxPoi();
        this.m_vBBbox = new okAABBox(vMinMaxPoiArr[0],vMinMaxPoiArr[1]);
    }

    /*
    @功能描述: 不向外暴露的私有方法，假设参数正确并直接set，不进行模型位置刷新，应有外部调用保证算法正确性。
     */
    this.__setPos = function(vCurPos){
        this.m_vPos = vCurPos;
    }

    this.setPos = function(vNewPos){
        var vOldPos = this.m_vPos;
        var movDir = okVec3Sub(vNewPos,vOldPos);
        /*原子内所有实体重新setPos()*/
        var entiArr = this.m_oEntiArr.values();
        for(var i = 0; i < entiArr.length; ++i){
            var newPos = okVec3Add(entiArr[i].getPos(),movDir);
            entiArr[i].setPos(newPos);
        }
        this.__setPos(vNewPos);
    }

    this.getPos = function(){
        return this.m_vPos;
    }

    this.getBoundingBox =function(){
        this.refreshBBox();
        return this.m_vBBbox;
    }

    this.setName = function(strName){
        this.m_strName = strName;
    }

    this.getName = function(){
        return this.m_strName;
    }

    this.isBelongto = function(obj){
        var entiArr = this.m_oEntiArr.values();
        for(var i = 0; i < entiArr.length; ++i){
            if(entiArr[i].getName() == obj.getName()){
                return true;
            }
        }
        return false;
    }

    /*
    @功能描述：
        合并原子，将_atom合并到this
     */
    this.mergeAtom  = function(_atom,strNewAtomName){
        var atomEntiArr = new Array();
        var thisEntiArr = this.m_oEntiArr.values();
        if(null != thisEntiArr && undefined != thisEntiArr){
            for(var i = 0; i < thisEntiArr.length; ++i){
                atomEntiArr.push(thisEntiArr[i]);
            }
        }
        var _atomEntiArr = _atom.getEngineEntiList();
        if(null != _atomEntiArr && undefined != _atomEntiArr){
            for(var i = 0; i < _atomEntiArr.length; ++i){
                atomEntiArr.push(_atomEntiArr[i]);
            }
        }
        //重新走Construct流程
        this.init(atomEntiArr,strNewAtomName);
    }

    this.mergeAtomList = function(_atomList,strNewAtomName){
        if(null != _atomList && undefined != _atomList){
            var atomEntiArr = new Array();
            var thisEntiArr = this.m_oEntiArr.values();
            if(null != thisEntiArr && undefined != thisEntiArr){
                for(var i = 0; i < thisEntiArr.length; ++i){
                    atomEntiArr.push(thisEntiArr[i]);
                }
            }
            for(var i = 0; i < _atomList.length; ++i){
                var curAtom = _atomList[i];
                var _atomEntiArr = curAtom.getEngineEntiList();
                if(null != _atomEntiArr && undefined != _atomEntiArr){
                    for(var j = 0; j < _atomEntiArr.length; ++j){
                        atomEntiArr.push(_atomEntiArr[j]);
                    }
                }
            }
            this.init(atomEntiArr,strNewAtomName);
        }
    }

    this.addEnti = function(_enti){

    }

    this.getEngineEntiList = function(){
        var arr = this.m_oEntiArr.values();
        return (null == arr)?(new Array()):(arr);
    }

    this.atomScale = function(Mode,scaleX,scaleY,scaleZ){
        var arr = this.m_oEntiArr.values();
        if(null != arr){
            for(var i = 0; i <  arr.length; ++i){
                arr[i].scale(Mode,scaleX,scaleY,scaleZ);
            }
        }
    }
}

/*
功能描述：规范原子类，一个原子可以是一个数据结构或者多个数据结构的并联（不维护层级关系），也可以是有限个可逆操作的序列。
主要用于支撑事务的回滚，备份，镜像等操作概念
 */
function ExtendAtom(){

}

/*
@功能描述: 事务层，封装用户的Undo Redo操作
 */
function DataLayer(){

}

/*
@功能描述：根类型，封装递归JavaScript对象判等，拷贝构造，传递构造，安全解引用等基础功能。
 */
function RootObject(){}
RootObject.prototype.equals = function(x)
{
    var p;
    for(p in this) {
        if(typeof(x[p])=='undefined') {return false;}
    }
    for(p in this) {
        if (this[p]) {
            switch(typeof(this[p])) {
                case 'object':
                    if (!this[p].equals(x[p])) { return false; } break;
                case 'function':
                    if (typeof(x[p])=='undefined' ||
                        (p != 'equals' && this[p].toString() != x[p].toString()))
                        return false;
                    break;
                default:
                    if (this[p] != x[p]) { return false; }
            }
        } else {
            if (x[p])
                return false;
        }
    }
    for(p in x) {
        if(typeof(this[p])=='undefined') {return false;}
    }
    return true;
}