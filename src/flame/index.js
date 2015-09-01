module.exports = {
    engine: {
        ray: {
            RayClosestFilterFunction: require('./engine/ray/RayClosestFilterFunction'),
            RayClosest: require('./engine/ray/RayClosest'),
        },
        FieldEngine: require('./engine/FieldEngine'),
        BodyBuilder: require('./engine/BodyBuilder'),
        ModuleAbstract: require('./engine/ModuleAbstract'),
        ModuleCocos: require('./engine/ModuleCocos'),
        ModuleVicinity: require('./engine/ModuleVicinity'),
        ModuleCocosVicinity: require('./engine/ModuleCocosVicinity'),
        ModuleBox2d: require('./engine/ModuleBox2d')
    },
    entity: {
        Avatar: require('./entity/Avatar'),
        Thing: require('./entity/Thing'),
        Field: require('./entity/Field')
    },
    rof: {
        Driver: require('./rof/Driver'),
        core: require('./rof/core'),
    },
    view: {
        Viewport: require('./view/Viewport'),
        Webpage: require('./view/Webpage'),
        Interactor: require('./view/Interactor'),
        LookBuilder: require('./view/LookBuilder'),
        fabric: {
            FabricNodeBuilder: require('./view/fabric/FabricNodeBuilder'),
            FabricViewport: require('./view/fabric/FabricViewport')
        },
        cocos: {
            CocosNodeBuilder: require('./view/cocos/CocosNodeBuilder'),
            CocosViewport: require('./view/cocos/CocosViewport')
        }
    },
    service: {
        serialize: {
            AbstractSerializer: require('./service/serialize/AbstractSerializer'),
            ThingSerializer: require('./service/serialize/ThingSerializer'),
            FieldSerializer: require('./service/serialize/FieldSerializer')
        },
        AssetManager: require('./service/AssetManager'),
        CosmosManager: require('./service/CosmosManager'),
        ThingBuilder: require('./service/ThingBuilder'),
        ThingPlanHelper: require('./service/ThingPlanHelper'),
        ThingFinder: require('./service/ThingFinder')
    },

};
