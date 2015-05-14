module.exports = {
    engine: {
        ray: {
            RayClosestFilterFunction: require('./engine/ray/RayClosestFilterFunction'),
            RayClosest: require('./engine/ray/RayClosest'),
        },
        FieldEngine: require('./engine/FieldEngine'),
        BodyBuilder: require('./engine/BodyBuilder'),
        ModuleCocos: require('./engine/ModuleCocos'),
        ModuleBox2d: require('./engine/ModuleBox2d')
    },
    entity: {
        Thing: require('./entity/Thing'),
        Field: require('./entity/Field')
    },
    rof: {
        Driver: require('./rof/Driver')
    },
    view: {
        Viewport: require('./view/Viewport'),
        Webpage: require('./view/Webpage'),
        Interactor: require('./view/Interactor'),
        AssetManager: require('./view/AssetManager'),
        StateBuilder: require('./view/StateBuilder'),
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
        CosmosManager: require('./service/CosmosManager'),
        ThingBuilder: require('./service/ThingBuilder'),
        ThingPlanHelper: require('./service/ThingPlanHelper'),
        ThingFinder: require('./service/ThingFinder')
    }
};
